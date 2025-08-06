import { NextResponse } from 'next/server';
import { validateAuthWithSchool } from '@/features/auth/operations';
import { getModulesForCourse, extractTextFromPage } from '@/lib/services/canvas/canvas.service';
import { ingestCanvasPage } from '@/lib/services/canvas/canvas-ingestion.service';
import logger from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await validateAuthWithSchool();
    const { courseId } = await params;

    const accessToken = (request.headers.get('Authorization') || '').replace('Bearer ', '');

    if (!accessToken) {
      return NextResponse.json({ error: 'Canvas access token not found.' }, { status: 400 });
    }

    logger.info({ userId, courseId }, 'Starting Canvas module sync');

    const modules = await getModulesForCourse(Number(courseId), accessToken);

    // Fire-and-forget ingestion tasks
    for (const module of modules) {
      for (const item of module.items) {
        if (item.type === 'Page' && item.url) {
          extractTextFromPage(item.url, accessToken)
            .then(pageContent => {
              if (pageContent) {
                // Do not await this call
                ingestCanvasPage(userId, courseId, item.title, pageContent, item.url);
              }
            })
            .catch(error => {
              logger.error({ 
                userId, 
                courseId, 
                itemTitle: item.title, 
                error 
              }, 'Failed to process a Canvas page');
            });
        }
      }
    }

    logger.info({ userId, courseId }, 'Canvas module sync initiated. Ingestion is running in the background.');

    return NextResponse.json({ 
      message: 'Module sync started. The content will be available shortly.' 
    });

  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error({ errorMessage, error }, 'Failed to initiate Canvas module sync.');
    return NextResponse.json({ error: 'Failed to sync modules.' }, { status: 500 });
  }
}
