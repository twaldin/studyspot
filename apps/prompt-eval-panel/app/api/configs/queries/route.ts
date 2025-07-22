import { NextRequest, NextResponse } from 'next/server';
import { ConfigManagerService } from '../../../../lib/services/config-manager.service';
import { TestQueriesConfig, ConfigSaveRequest } from '../../../../lib/types/config.types';

const configManager = new ConfigManagerService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (filename) {
      // Load specific config
      const config = await configManager.loadQueriesConfig(filename);
      return NextResponse.json(config);
    } else {
      // List all available configs
      const configs = await configManager.listQueriesConfigs();
      return NextResponse.json({ configs });
    }
  } catch (error) {
    console.error('Error loading queries config:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { filename, config }: ConfigSaveRequest = await request.json();
    
    if (!filename) {
      return NextResponse.json({ error: 'filename is required' }, { status: 400 });
    }

    if (!filename.endsWith('.json')) {
      return NextResponse.json({ error: 'filename must end with .json' }, { status: 400 });
    }

    await configManager.saveQueriesConfig(filename, config as TestQueriesConfig);
    return NextResponse.json({ success: true, message: `Config saved as ${filename}` });
  } catch (error) {
    console.error('Error saving queries config:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ error: 'filename is required' }, { status: 400 });
    }

    await configManager.deleteQueriesConfig(filename);
    return NextResponse.json({ success: true, message: `Config ${filename} deleted` });
  } catch (error) {
    console.error('Error deleting queries config:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}