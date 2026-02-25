import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createServerClient();
  const body = await request.json();
  const { task_id, new_value, added_by } = body;

  if (!task_id || new_value === undefined || !added_by) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Get current task
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", task_id)
    .single();

  if (taskError || !task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const clampedValue = Math.max(task.start_value, Math.min(task.end_value, new_value));

  // Insert progress entry
  const { error: progressError } = await supabase
    .from("progress_entries")
    .insert({
      task_id,
      previous_value: task.current_value,
      new_value: clampedValue,
      added_by: added_by.trim(),
    });

  if (progressError) {
    return NextResponse.json({ error: progressError.message }, { status: 500 });
  }

  // Update task current_value
  const { data: updatedTask, error: updateError } = await supabase
    .from("tasks")
    .update({
      current_value: clampedValue,
      updated_at: new Date().toISOString(),
    })
    .eq("id", task_id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json(updatedTask);
}
