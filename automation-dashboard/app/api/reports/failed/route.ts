import { getThirdPartyApis } from "@/services/report-parser";
import { NextResponse } from "next/server";

export async function GET() {
  const logs = getThirdPartyApis() as Record<string, unknown>[];
  const failed = logs.filter(
    (l) => typeof l.statusCode === "number" && ((l.statusCode as number) < 200 || (l.statusCode as number) > 299)
  );
  return NextResponse.json(failed);
}
