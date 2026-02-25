import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { generateRoomCode } from "@/lib/utils";

export async function POST(request: Request) {
  const supabase = createServerClient();
  const body = await request.json();
  const { name } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Room name is required" }, { status: 400 });
  }

  const code = generateRoomCode();

  const { data, error } = await supabase
    .from("rooms")
    .insert({ code, name: name.trim() })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
