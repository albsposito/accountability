"use client";

import { useRoom } from "./RoomProvider";
import TaskCard from "./TaskCard";

export default function TaskList() {
  const { tasks } = useRoom();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--muted)]">
        <p className="text-lg mb-1">No tasks yet</p>
        <p className="text-sm">Create your first task to start building!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
