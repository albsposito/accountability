import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import RoomProvider from "@/components/room/RoomProvider";
import RoomView from "@/components/room/RoomView";

interface RoomPageProps {
  params: Promise<{ code: string }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { code } = await params;
  const supabase = createServerClient();

  const { data: room } = await supabase
    .from("rooms")
    .select("*")
    .eq("code", code)
    .single();

  if (!room) notFound();

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("room_id", room.id)
    .order("created_at", { ascending: true });

  return (
    <RoomProvider room={room} initialTasks={tasks || []}>
      <RoomView />
    </RoomProvider>
  );
}
