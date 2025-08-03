'use server';

import { ICourse } from '@/features/courses/course.model';
import logger from '@/lib/logger';
import { z } from 'zod';
import { createCourse as createCourseInDb } from '@/features/courses/operations';
import { ingestCanvasPage } from './canvas-ingestion.service';
import { createServiceRoleClient } from '../database/supabase.service';
import { CanvasAPIError } from './canvas.error';
import { UTApi } from "uploadthing/server";
import { documentIngestionService } from '../document-ingestion/document-ingestion.service';

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

export type CanvasCourse = z.infer<typeof canvasCourseSchema>;
export type CanvasModule = z.infer<typeof canvasModuleSchema>;

const baseUrl = 'https://canvas.instructure.com/api/v1';

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
  const newCourseResult = await createCourseInDb(
    supabase,
    {
      title: course.name,
      code: course.course_code.trim(),
      schoolId: schoolId,
    }
  );
  return newCourseResult.course;
}

async function ingestContentForCourse(
  dbCourse: ICourse,
  canvasCourseId: number,
  userId: string,
  accessToken: string
): Promise<void> {
  logger.info({ courseId: dbCourse.id }, "Starting content ingestion for course.");
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

          const { key, url } = uploadedFileResponse.data;

          await documentIngestionService.ingestDocument({
            fileKey: key,
            fileName: fileMetadata.display_name,
            fileUrl: url,
            fileType: fileMetadata['content-type'],
            courseId: dbCourse.id,
          });

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

    const courses = await response.json();
    return z.array(canvasCourseSchema).parse(courses);
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
  courses: CanvasCourse[],
  accessToken: string,
): Promise<ICourse[]> {
  const syncedCourses: ICourse[] = [];

  for (const course of courses) {
    try {
      let dbCourse = await getCourseByCode(course.course_code, schoolId);

      if (!dbCourse) {
        dbCourse = await createCourseFromCanvas(course, schoolId);
      } else {
        logger.info({ courseName: course.name }, "Course found in DB, skipping creation.");
      }

      if (!dbCourse) {
        throw new Error('Failed to create or find course in the database');
      }

      await ingestContentForCourse(dbCourse, course.id, userId, accessToken);
      syncedCourses.push(dbCourse);
    } catch (error) {
      logger.error({ error, courseName: course.name }, 'Failed to sync course with Canvas');
    }
  }
  return syncedCourses;
}
