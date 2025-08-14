import { NextResponse } from 'next/server';
import { z } from 'zod';

const validateTokenSchema = z.object({
  accessToken: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accessToken } = validateTokenSchema.parse(body);

    const response = await fetch('https://canvas.instructure.com/api/v1/users/self/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const profile = await response.json();
      return NextResponse.json({ valid: true, profile });
    } else {
      return NextResponse.json({ valid: false }, { status: response.status });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to validate token' }, { status: 500 });
  }
}
