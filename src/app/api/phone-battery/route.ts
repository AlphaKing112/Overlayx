import { NextResponse } from 'next/server';

// In-memory storage for the latest battery info
let latestBattery: { level: number; timestamp: string; charging?: boolean } | null = null;

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (typeof data.level !== 'number') {
      return NextResponse.json({ error: 'Missing or invalid battery level' }, { status: 400 });
    }
    latestBattery = {
      level: data.level,
      timestamp: new Date().toISOString(),
      charging: typeof data.charging === 'boolean' ? data.charging : false,
    };
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET() {
  if (!latestBattery) {
    return NextResponse.json({ level: null, charging: false, timestamp: null });
  }
  return NextResponse.json(latestBattery);
} 