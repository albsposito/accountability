import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createServerClient();
  const body = await request.json();
  const { room_id, title, description, start_value, end_value, created_by, color } = body;

  if (!room_id || !title || end_value === undefined || !created_by) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      room_id,
      title: title.trim(),
      description: description?.trim() || "",
      start_value: start_value ?? 0,
      end_value,
      current_value: start_value ?? 0,
      created_by: created_by.trim(),
      color: color || "#3B82F6",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
