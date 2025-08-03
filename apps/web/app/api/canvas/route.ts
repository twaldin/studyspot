
import { NextRequest, NextResponse } from 'next/server';
import { clerkClient, currentUser } from '@clerk/nextjs/server';

import { encrypt } from '@/lib/utils/crypto';
import { z } from 'zod';

const saveTokenSchema = z.object({
  accessToken: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { accessToken } = saveTokenSchema.parse(body);

    const encryptedToken = encrypt(accessToken);

    const client = await clerkClient();
    await client.users.updateUserMetadata(user.id, {
      privateMetadata: {
        canvasToken: encryptedToken,
      },
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set('canvas-token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to save Canvas token' }, { status: 500 });
  }
}
