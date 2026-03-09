import { getThirdPartyApis, aggregateEndpointStats } from "@/services/report-parser";
import { NextResponse } from "next/server";

export async function GET() {
  const logs = getThirdPartyApis();
  const stats = aggregateEndpointStats(logs);
  return NextResponse.json({ logs, stats });
}
