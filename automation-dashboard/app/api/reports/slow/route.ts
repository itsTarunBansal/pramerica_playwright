import { getThirdPartyApis } from "@/services/report-parser";
import { NextResponse } from "next/server";

const SLOW_THRESHOLD = 2000;

export async function GET() {
  const logs = getThirdPartyApis() as Record<string, unknown>[];
  const slow = logs.filter((l) => (l.responseTime as number) > SLOW_THRESHOLD);
  return NextResponse.json(slow);
}
