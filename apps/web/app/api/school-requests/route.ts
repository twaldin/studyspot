import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/services/database/supabase.service";
import logger from "@/lib/logger";

export async function POST(request: Request) {
  const { schoolName } = await request.json();

  if (!schoolName || typeof schoolName !== "string" || schoolName.trim().length === 0) {
    return NextResponse.json({ message: "School name is required." }, { status: 400 });
  }

  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("school_requests")
      .insert([{ school_name: schoolName.trim() }]);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: "School request submitted successfully!" });
  } catch (error: any) {
    logger.error({ error, schoolName }, "Failed to submit school request");
    return NextResponse.json({ message: `An error occurred: ${error.message}` }, { status: 500 });
  }
}
