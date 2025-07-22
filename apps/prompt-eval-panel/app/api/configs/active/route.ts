import { NextRequest, NextResponse } from 'next/server';
import { ConfigManagerService } from '../../../../lib/services/config-manager.service';

const configManager = new ConfigManagerService();

export async function GET(request: NextRequest) {
  try {
    const [activePrompt, testPrompt, queries] = await Promise.all([
      configManager.loadActivePromptConfig(),
      configManager.loadTestPromptConfig(),
      configManager.loadActiveQueriesConfig()
    ]);

    return NextResponse.json({
      activePrompt,
      testPrompt,
      queries
    });
  } catch (error) {
    console.error('Error loading active configs:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}