"use client";

import { useState } from "react";
import { useRoom } from "./RoomProvider";
import NamePrompt from "./NamePrompt";
import TaskList from "./TaskList";
import AddTaskModal from "./AddTaskModal";
import Button from "@/components/ui/Button";

export default function RoomView() {
  const { room, userName } = useRoom();
  const [showAddTask, setShowAddTask] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/room/${room.code}`
      : "";

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      <NamePrompt />

      <header className="border-b border-[var(--border)] bg-[var(--card-bg)]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{room.name}</h1>
            <p className="text-sm text-[var(--muted)]">
              {userName ? `Logged in as ${userName}` : "Joining..."}
              {" · "}
              Room: {room.code}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={copyLink}>
              {copied ? "Copied!" : "Share Link"}
            </Button>
            {userName && (
              <Button size="sm" onClick={() => setShowAddTask(true)}>
                + New Task
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <TaskList />
      </main>

      <AddTaskModal open={showAddTask} onClose={() => setShowAddTask(false)} />
    </div>
  );
}
