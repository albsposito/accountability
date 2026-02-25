"use client";

import { useState, useEffect, useRef } from "react";
import { Task } from "@/types/database";
import { getProgressPercent } from "@/lib/constants";
import LegoBuilding from "@/components/lego/LegoBuilding";
import Celebration from "@/components/lego/Celebration";
import Button from "@/components/ui/Button";
import { useRoom } from "./RoomProvider";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { userName, updateTaskOptimistic } = useRoom();
  const [loading, setLoading] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const prevValueRef = useRef(task.current_value);
  const cardRef = useRef<HTMLDivElement>(null);

  const percent = getProgressPercent(
    task.start_value,
    task.end_value,
    task.current_value
  );
  const isComplete = task.current_value >= task.end_value;

  // Detect when task just became complete
  useEffect(() => {
    const wasComplete = prevValueRef.current >= task.end_value;
    const nowComplete = task.current_value >= task.end_value;

    if (nowComplete && !wasComplete) {
      setCelebrating(true);
      const timer = setTimeout(() => setCelebrating(false), 2500);
      prevValueRef.current = task.current_value;
      return () => clearTimeout(timer);
    }
    prevValueRef.current = task.current_value;
  }, [task.current_value, task.end_value]);

  const handleIncrement = async () => {
    if (!userName || isComplete) return;
    setLoading(true);

    const newValue = Math.min(task.current_value + 1, task.end_value);
    updateTaskOptimistic(task.id, { current_value: newValue });

    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_id: task.id,
          new_value: newValue,
          added_by: userName,
        }),
      });
    } catch {
      updateTaskOptimistic(task.id, { current_value: task.current_value });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this task?")) return;
    await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
  };

  return (
    <div
      ref={cardRef}
      className="relative rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4 flex flex-col gap-3"
    >
      <Celebration show={celebrating} color={task.color} />

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-[var(--muted)] mt-0.5 truncate">
              {task.description}
            </p>
          )}
          <p className="text-xs text-[var(--muted)] mt-1">
            by {task.created_by}
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="text-[var(--muted)] hover:text-red-500 text-sm ml-2 shrink-0"
          title="Delete task"
        >
          &times;
        </button>
      </div>

      <div className="flex items-end gap-4">
        <LegoBuilding
          taskId={task.id}
          startValue={task.start_value}
          endValue={task.end_value}
          currentValue={task.current_value}
          color={task.color}
        />
        <div className="flex-1 flex flex-col gap-2">
          <div className="text-sm">
            <span className="font-bold text-lg">{percent}%</span>
            <span className="text-[var(--muted)] ml-1">
              ({task.current_value} / {task.end_value})
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--hover-bg)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${percent}%`,
                backgroundColor: task.color,
              }}
            />
          </div>
          {isComplete ? (
            <div className="text-sm font-semibold text-green-500 text-center py-1.5">
              Complete!
            </div>
          ) : (
            <Button
              size="sm"
              onClick={handleIncrement}
              disabled={loading || !userName}
            >
              +1
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
