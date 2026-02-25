import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const supabase = createServerClient();

  const { data: room, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("code", code)
    .single();

  if (error || !room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("room_id", room.id)
    .order("created_at", { ascending: true });

  return NextResponse.json({ room, tasks: tasks || [] });
}
