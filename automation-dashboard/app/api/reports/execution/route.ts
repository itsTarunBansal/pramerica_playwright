import { getExecutionSummary } from "@/services/report-parser";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(getExecutionSummary());
}
