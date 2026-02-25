"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useRoom } from "./RoomProvider";
import { Task } from "@/types/database";
import { getProgressPercent } from "@/lib/constants";

interface UpdateProgressModalProps {
  open: boolean;
  onClose: () => void;
  task: Task;
}

export default function UpdateProgressModal({
  open,
  onClose,
  task,
}: UpdateProgressModalProps) {
  const { userName, updateTaskOptimistic } = useRoom();
  const [value, setValue] = useState(task.current_value);
  const [loading, setLoading] = useState(false);

  const percent = getProgressPercent(task.start_value, task.end_value, value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName) return;

    setLoading(true);
    // Optimistic update
    updateTaskOptimistic(task.id, { current_value: value });

    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_id: task.id,
          new_value: value,
          added_by: userName,
        }),
      });
      onClose();
    } catch {
      // Revert on error
      updateTaskOptimistic(task.id, { current_value: task.current_value });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Update: ${task.title}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>
              {task.start_value} → {task.end_value}
            </span>
            <span className="font-semibold">{percent}%</span>
          </div>
          <input
            type="range"
            min={task.start_value}
            max={task.end_value}
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="text-center mt-2">
            <span className="text-2xl font-bold">{value}</span>
            <span className="text-sm text-[var(--muted)] ml-1">
              / {task.end_value}
            </span>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || value === task.current_value}>
            {loading ? "Saving..." : "Update Progress"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
