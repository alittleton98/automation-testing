import { APP_VERSION } from '@autotest/core';

export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json({ status: 'ok', version: APP_VERSION });
}
