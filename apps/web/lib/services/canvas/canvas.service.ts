'use server';

import { ICourse } from '@/features/courses/course.model';
import logger from '@/lib/logger';
import { z } from 'zod';
import { createCourse as createCourseInDb } from '@/features/courses/operations';
import { ingestCanvasPage } from './canvas-ingestion.service';
import { createServiceRoleClient } from '../database/supabase.service';
import { CanvasAPIError } from './canvas.error';
import { UTApi } from "uploadthing/server";
import { courseCodeGeneratorService } from '../ai/course-code-generator.service';
// Use the same ingestion API as the file upload form

const utapi = new UTApi();

const canvasCourseSchema = z.object({
  id: z.number(),
  name: z.string(),
  course_code: z.string(),
});

const canvasFileSchema = z.object({
  id: z.number(),
  display_name: z.string(),
  "content-type": z.string(),
  url: z.string(),
  size: z.number(),
});

const canvasModuleItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  type: z.string(),
  url: z.string().optional(),
  page_url: z.string().optional(),
});

const canvasModuleSchema = z.object({
  id: z.number(),
  name: z.string(),
  items: z.array(canvasModuleItemSchema),
});

const canvasAssignmentSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  html_url: z.string(),
});

const canvasFrontPageSchema = z.object({
  url: z.string(),
  title: z.string(),
  body: z.string().nullable(),
});

const canvasAnnouncementSchema = z.object({
  id: z.number(),
  title: z.string(),
  message: z.string().nullable(),
  html_url: z.string(),
});

export type CanvasCourse = z.infer<typeof canvasCourseSchema> & {
  availableContentTypes?: string[];
};
export type CanvasModule = z.infer<typeof canvasModuleSchema>;
export type CanvasFile = z.infer<typeof canvasFileSchema>;
export type CanvasAssignment = z.infer<typeof canvasAssignmentSchema>;
export type CanvasFrontPage = z.infer<typeof canvasFrontPageSchema>;
export type CanvasAnnouncement = z.infer<typeof canvasAnnouncementSchema>;


const baseUrl = 'https://canvas.instructure.com/api/v1';

async function getCourseByCanvasId(canvasCourseId: number, schoolId: string): Promise<ICourse | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('canvas_course_id', canvasCourseId)
    .eq('school_id', schoolId)
    .single();

  if (error && error.code !== 'PGRST116') {
    logger.error({ error, canvasCourseId, schoolId }, 'Error fetching course by canvas_course_id');
    return null;
  }
  return data;
}

async function getCourseByCode(courseCode: string, schoolId: string): Promise<ICourse | null> {
  const supabase = createServiceRoleClient();
  const normalizedCourseCode = courseCode.trim();

  if (!normalizedCourseCode) {
    return null;
  }

  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .ilike('code', normalizedCourseCode)
    .eq('school_id', schoolId)
    .single();

  if (error && error.code !== 'PGRST116') {
    logger.error({ error, courseCode, schoolId }, 'Error fetching course by code');
    return null;
  }
  return data;
}

async function createCourseFromCanvas(course: CanvasCourse, schoolId: string): Promise<ICourse> {
  const supabase = createServiceRoleClient();
  logger.info({ courseName: course.name }, "Course not found in DB, creating new entry.");

  const courseName = course.name.trim();
  const courseCode = await courseCodeGeneratorService.generateCourseCode(courseName);

  const newCourseResult = await createCourseInDb(
    supabase,
    {
      title: courseName,
      code: courseCode,
      schoolId: schoolId,
      canvas_course_id: course.id,
    }
  );
  return newCourseResult.course;
}

async function ingestContentForCourse(
  dbCourse: ICourse,
  canvasCourseId: number,
  userId: string,
  accessToken: string,
  contentTypes: string[]
): Promise<void> {
  logger.info({ courseId: dbCourse.id, contentTypes }, "Starting content ingestion for course.");

  if (contentTypes.includes('Homepage')) {
    try {
      const homepage = await getCanvasCourseHomepage(canvasCourseId, accessToken);
      if (homepage && homepage.body) {
        const cleanBody = homepage.body.replace(/<[^>]*>?/gm, '').trim();
        if (cleanBody) {
          await ingestCanvasPage(userId, dbCourse.id, homepage.title, cleanBody, homepage.url);
          logger.info({ courseId: dbCourse.id, pageTitle: homepage.title }, "Successfully ingested homepage.");
        } else {
          logger.warn({ courseId: dbCourse.id, pageTitle: homepage.title }, "Skipping empty homepage.");
        }
      }
    } catch (ingestionError: any) {
      logger.error(
        {
          error: ingestionError.message,
        },
        "Failed to ingest homepage, continuing with next item."
      );
    }
  }

  if (contentTypes.includes('Announcements')) {
    const announcements = await getCanvasCourseAnnouncements(canvasCourseId, accessToken);
    for (const announcement of announcements) {
      try {
        if (announcement.message) {
          const cleanMessage = announcement.message.replace(/<[^>]*>?/gm, '').trim();
          if (cleanMessage) {
            await ingestCanvasPage(userId, dbCourse.id, announcement.title, cleanMessage, announcement.html_url);
            logger.info({ courseId: dbCourse.id, announcementTitle: announcement.title }, "Successfully ingested announcement.");
          } else {
            logger.warn({ courseId: dbCourse.id, announcementTitle: announcement.title }, "Skipping empty announcement after HTML stripping.");
          }
        } else {
          logger.warn({ courseId: dbCourse.id, announcementTitle: announcement.title }, "Skipping empty announcement.");
        }
      } catch (ingestionError: any) {
        logger.error(
          {
            announcementTitle: announcement.title,
            error: ingestionError.message,
          },
          "Failed to ingest announcement, continuing with next item."
        );
      }
    }
  }

  if (contentTypes.includes('Modules')) {
    const modules = await getModulesForCourse(canvasCourseId, accessToken);
    for (const courseModule of modules) {
      for (const item of courseModule.items) {
        if (item.type === 'Page' && item.url) {
          try {
            const content = await extractTextFromPage(item.url, accessToken);
            if (content) {
              await ingestCanvasPage(userId, dbCourse.id, item.title, content, item.url);
              logger.info({ courseId: dbCourse.id, pageTitle: item.title }, "Successfully ingested page.");
            } else {
              logger.warn({ courseId: dbCourse.id, pageTitle: item.title }, "Skipping empty page.");
            }
          } catch (ingestionError: any) {
            logger.error(
              {
                pageTitle: item.title,
                error: ingestionError.message,
              },
              "Failed to ingest page, continuing with next item."
            );
          }
        } else if (item.type === 'File' && item.url) {
          try {
            const fileMetadataResponse = await fetch(item.url, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!fileMetadataResponse.ok) throw new Error(`Failed to fetch file metadata from Canvas: ${fileMetadataResponse.statusText}`);
            
            const fileMetadata = canvasFileSchema.parse(await fileMetadataResponse.json());

            const fileContentResponse = await fetch(fileMetadata.url, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!fileContentResponse.ok) throw new Error(`Failed to download file from Canvas: ${fileContentResponse.statusText}`);

            const fileContent = await fileContentResponse.blob();

            const uploadedFileResponse = await utapi.uploadFiles(new File([fileContent], fileMetadata.display_name, { type: fileMetadata['content-type'] }));
            if (uploadedFileResponse.error) throw new Error('File upload via UTApi failed', { cause: uploadedFileResponse.error });

            const { key, ufsUrl } = uploadedFileResponse.data;

            // Use the same ingestion API as the file upload form
            const ingestionResponse = await fetch('/api/documents/ingest-stream', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                files: [{
                  fileKey: key,
                  fileName: fileMetadata.display_name,
                  fileUrl: ufsUrl,
                  fileType: fileMetadata['content-type'],
                }],
                courseId: dbCourse.id,
                userId,
              }),
            });

            if (!ingestionResponse.ok) {
              const errorText = await ingestionResponse.text();
              throw new Error(`Document ingestion failed: ${errorText}`);
            }

            logger.info({ courseId: dbCourse.id, fileName: fileMetadata.display_name }, "Successfully ingested file.");

          } catch (ingestionError: any) {
            logger.error(
              {
                fileName: item.title,
                error: ingestionError.message,
              },
              "Failed to ingest file, continuing with next item."
            );
          }
        }
      }
    }
  }

  if (contentTypes.includes('Files')) {
    const files = await getFilesForCourse(canvasCourseId, accessToken);
    for (const file of files) {
      try {
        const fileContentResponse = await fetch(file.url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!fileContentResponse.ok) throw new Error(`Failed to download file from Canvas: ${fileContentResponse.statusText}`);

        const fileContent = await fileContentResponse.blob();

        const uploadedFileResponse = await utapi.uploadFiles(new File([fileContent], file.display_name, { type: file['content-type'] }));
        if (uploadedFileResponse.error) throw new Error('File upload via UTApi failed', { cause: uploadedFileResponse.error });

        const { key, ufsUrl } = uploadedFileResponse.data;

        // Use the same ingestion API as the file upload form
        const ingestionResponse = await fetch('/api/documents/ingest-stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            files: [{
              fileKey: key,
              fileName: file.display_name,
              fileUrl: ufsUrl,
              fileType: file['content-type'],
            }],
            courseId: dbCourse.id,
            userId,
          }),
        });

        if (!ingestionResponse.ok) {
          const errorText = await ingestionResponse.text();
          throw new Error(`Document ingestion failed: ${errorText}`);
        }

        logger.info({ courseId: dbCourse.id, fileName: file.display_name }, "Successfully ingested file.");
      } catch (ingestionError: any) {
        logger.error(
          {
            fileName: file.display_name,
            error: ingestionError.message,
          },
          "Failed to ingest file, continuing with next item."
        );
      }
    }
  }

  if (contentTypes.includes('Assignments')) {
    const assignments = await getAssignmentsForCourse(canvasCourseId, accessToken);
    for (const assignment of assignments) {
      try {
        if (assignment.description) {
          const cleanDescription = assignment.description.replace(/<[^>]*>?/gm, '').trim();
          if (cleanDescription) {
            await ingestCanvasPage(userId, dbCourse.id, assignment.name, cleanDescription, assignment.html_url);
            logger.info({ courseId: dbCourse.id, assignmentName: assignment.name }, "Successfully ingested assignment.");
          } else {
            logger.warn({ courseId: dbCourse.id, assignmentName: assignment.name }, "Skipping empty assignment after HTML stripping.");
          }
        } else {
          logger.warn({ courseId: dbCourse.id, assignmentName: assignment.name }, "Skipping empty assignment.");
        }
      } catch (ingestionError: any) {
        logger.error(
          {
            assignmentName: assignment.name,
            error: ingestionError.message,
          },
          "Failed to ingest assignment, continuing with next item."
        );
      }
    }
  }
}

export async function getCanvasCourses(accessToken: string): Promise<CanvasCourse[]> {
  try {
    const response = await fetch(`${baseUrl}/courses?enrollment_state=active`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new CanvasAPIError(`Failed to fetch courses from Canvas: ${response.statusText}`, response.status);
    }

    const coursesData = await response.json();
    const courses = z.array(canvasCourseSchema).parse(coursesData);

    const coursesWithContent = await Promise.all(
      courses.map(async (course) => {
        const availableContentTypes: string[] = [];

        const contentChecks = await Promise.allSettled([
          // Check for Homepage
          fetch(`${baseUrl}/courses/${course.id}/front_page`, { headers: { Authorization: `Bearer ${accessToken}` } }),
          // Check for Announcements
          fetch(`${baseUrl}/courses/${course.id}/discussion_topics?only_announcements=true&per_page=1`, { headers: { Authorization: `Bearer ${accessToken}` } }),
          // Check for Modules
          fetch(`${baseUrl}/courses/${course.id}/modules?per_page=1`, { headers: { Authorization: `Bearer ${accessToken}` } }),
          // Check for Files
          fetch(`${baseUrl}/courses/${course.id}/files?per_page=1`, { headers: { Authorization: `Bearer ${accessToken}` } }),
          // Check for Assignments
          fetch(`${baseUrl}/courses/${course.id}/assignments?per_page=1`, { headers: { Authorization: `Bearer ${accessToken}` } }),
        ]);

        const [homepageResult, announcementsResult, modulesResult, filesResult, assignmentsResult] = await Promise.all(contentChecks.map(async res => {
          if (res.status === 'fulfilled' && res.value.ok) {
            // For homepage, a 200 OK is enough. For lists, check if the array is non-empty.
            if (res.value.url.includes('front_page')) {
              return res.value.json().then(data => (data && data.body ? [data] : [])).catch(() => []);
            }
            return res.value.json();
          }
          return [];
        }));

        if (homepageResult.length > 0) availableContentTypes.push('Homepage');
        if (announcementsResult.length > 0) availableContentTypes.push('Announcements');
        if (modulesResult.length > 0) availableContentTypes.push('Modules');
        if (filesResult.length > 0) availableContentTypes.push('Files');
        if (assignmentsResult.length > 0) availableContentTypes.push('Assignments');
        
        return { ...course, availableContentTypes };
      })
    );

    return coursesWithContent;
  } catch (error) {
    logger.error({ error }, 'Failed to get courses from Canvas');
    throw error;
  }
}

export async function getModulesForCourse(courseId: number, accessToken: string): Promise<CanvasModule[]> {
  let modules: CanvasModule[] = [];
  let url = `${baseUrl}/courses/${courseId}/modules?include[]=items`;

  try {
    while (url) {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to fetch modules from Canvas: ${response.statusText} - ${errorBody}`);
      }

      const data = await response.json();
      modules = modules.concat(z.array(canvasModuleSchema).parse(data));

      const linkHeader = response.headers.get('Link');
      const nextLink = linkHeader?.split(',').find(s => s.includes('rel="next"'));
      url = nextLink ? (nextLink.match(/<(.*)>/)?.[1] ?? '') : '';
    }
    return modules;
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      {
        message: 'Failed to get modules from Canvas',
        errorMessage: errorMessage,
        error: error,
      },
      'Failed to get modules from Canvas'
    );
    throw error;
  }
}

export async function getFilesForCourse(courseId: number, accessToken: string): Promise<CanvasFile[]> {
  let files: CanvasFile[] = [];
  let url = `${baseUrl}/courses/${courseId}/files`;

  try {
    while (url) {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to fetch files from Canvas: ${response.statusText} - ${errorBody}`);
      }

      const data = await response.json();
      files = files.concat(z.array(canvasFileSchema).parse(data));

      const linkHeader = response.headers.get('Link');
      const nextLink = linkHeader?.split(',').find(s => s.includes('rel="next"'));
      url = nextLink ? (nextLink.match(/<(.*)>/)?.[1] ?? '') : '';
    }
    return files;
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      {
        message: 'Failed to get files from Canvas',
        errorMessage: errorMessage,
        error: error,
      },
      'Failed to get files from Canvas'
    );
    throw error;
  }
}

export async function getAssignmentsForCourse(courseId: number, accessToken: string): Promise<CanvasAssignment[]> {
  let assignments: CanvasAssignment[] = [];
  let url = `${baseUrl}/courses/${courseId}/assignments`;

  try {
    while (url) {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to fetch assignments from Canvas: ${response.statusText} - ${errorBody}`);
      }

      const data = await response.json();
      assignments = assignments.concat(z.array(canvasAssignmentSchema).parse(data));

      const linkHeader = response.headers.get('Link');
      const nextLink = linkHeader?.split(',').find(s => s.includes('rel="next"'));
      url = nextLink ? (nextLink.match(/<(.*)>/)?.[1] ?? '') : '';
    }
    return assignments;
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      {
        message: 'Failed to get assignments from Canvas',
        errorMessage: errorMessage,
        error: error,
      },
      'Failed to get assignments from Canvas'
    );
    throw error;
  }
}

export async function extractTextFromPage(pageUrl: string, accessToken: string): Promise<string> {
  try {
    const response = await fetch(pageUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page content from Canvas: ${response.statusText}`);
    }

    const pageData = await response.json();
    if (pageData.body) {
      return pageData.body.replace(/<[^>]*>?/gm, '');
    }
    return '';
  } catch (error) {
    logger.error({ error }, 'Failed to extract text from Canvas page');
    throw error;
  }
}

export async function syncCanvasCourses(
  userId: string,
  schoolId: string,
  courses: { course: CanvasCourse; contentTypes: string[] }[],
  accessToken: string,
): Promise<ICourse[]> {
  const syncedCourses: ICourse[] = [];
  const supabase = createServiceRoleClient();

  for (const { course, contentTypes } of courses) {
    try {
      // Step 1: Check for an existing course by Canvas ID (exact match)
      let dbCourse = await getCourseByCanvasId(course.id, schoolId);

      if (!dbCourse) {
        // Step 2: Check for an existing course by code (heuristic match for manually created courses)
        dbCourse = await getCourseByCode(course.course_code, schoolId);
        if (dbCourse) {
          // If found, link it by updating the canvas_course_id
          logger.info({ courseName: course.name, courseId: dbCourse.id }, "Found matching course by code, linking to Canvas ID.");
          const { error } = await supabase
            .from('courses')
            .update({ canvas_course_id: course.id })
            .eq('id', dbCourse.id);
          if (error) {
            logger.error({ error, courseId: dbCourse.id }, "Failed to link course to Canvas ID.");
            // Continue to the next course if linking fails
            continue;
          }
        }
      }

      // Step 3: If no course was found by either method, create a new one
      if (!dbCourse) {
        dbCourse = await createCourseFromCanvas(course, schoolId);
      } else {
        logger.info({ courseName: course.name }, "Course already exists in DB, skipping creation.");
      }

      if (!dbCourse) {
        throw new Error('Failed to create or find course in the database');
      }

      await ingestContentForCourse(dbCourse, course.id, userId, accessToken, contentTypes);
      syncedCourses.push(dbCourse);
    } catch (error) {
      logger.error({ error, courseName: course.name }, 'Failed to sync course with Canvas');
    }
  }
  return syncedCourses;
}


export async function getCanvasCourseHomepage(courseId: number, accessToken: string): Promise<CanvasFrontPage | null> {
  try {
    const response = await fetch(`${baseUrl}/courses/${courseId}/front_page`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      // A 404 here is not an error, it just means the course has no front page.
      if (response.status === 404) {
        return null;
      }
      throw new CanvasAPIError(`Failed to fetch homepage from Canvas: ${response.statusText}`, response.status);
    }

    const pageData = await response.json();
    return canvasFrontPageSchema.parse(pageData);
  } catch (error) {
    logger.error({ error, courseId }, 'Failed to get course homepage from Canvas');
    throw error;
  }
}

export async function getCanvasCourseAnnouncements(courseId: number, accessToken: string): Promise<CanvasAnnouncement[]> {
  let announcements: CanvasAnnouncement[] = [];
  let url = `${baseUrl}/courses/${courseId}/discussion_topics?only_announcements=true`;

  try {
    while (url) {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to fetch announcements from Canvas: ${response.statusText} - ${errorBody}`);
      }

      const data = await response.json();
      announcements = announcements.concat(z.array(canvasAnnouncementSchema).parse(data));

      const linkHeader = response.headers.get('Link');
      const nextLink = linkHeader?.split(',').find(s => s.includes('rel="next"'));
      url = nextLink ? (nextLink.match(/<(.*)>/)?.[1] ?? '') : '';
    }
    return announcements;
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      {
        message: 'Failed to get announcements from Canvas',
        errorMessage: errorMessage,
        error: error,
      },
      'Failed to get announcements from Canvas'
    );
    throw error;
  }
}
