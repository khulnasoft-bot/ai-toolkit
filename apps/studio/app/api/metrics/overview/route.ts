import { NextResponse } from 'next/server';
import { getGatewayRows } from '@/lib/gateways';
import { getMetricsProvider } from '@/lib/metrics-provider';
import { getGatewayModels } from '@/lib/models';
import { getProviders } from '@/lib/providers';
import { tools } from '@/lib/tools';

export const revalidate = 60;

export async function GET() {
  const counts = {
    providers: getProviders().length,
    models: getGatewayModels().length,
    gateways: getGatewayRows().length,
    tools: tools.length,
  };
  const payload = await getMetricsProvider().overview(counts);
  return NextResponse.json(payload);
}
