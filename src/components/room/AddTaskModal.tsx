"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useRoom } from "./RoomProvider";
import { LEGO_COLORS } from "@/lib/constants";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddTaskModal({ open, onClose }: AddTaskModalProps) {
  const { room, userName } = useRoom();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startValue, setStartValue] = useState("0");
  const [endValue, setEndValue] = useState("100");
  const [color, setColor] = useState(LEGO_COLORS[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !userName) return;

    setLoading(true);
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_id: room.id,
          title: title.trim(),
          description: description.trim(),
          start_value: parseInt(startValue) || 0,
          end_value: parseInt(endValue) || 100,
          created_by: userName,
          color,
        }),
      });
      setTitle("");
      setDescription("");
      setStartValue("0");
      setEndValue("100");
      setColor(LEGO_COLORS[0]);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="New Task">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          id="task-title"
          label="Title"
          placeholder="e.g., Read 'Atomic Habits'"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <Input
          id="task-desc"
          label="Description (optional)"
          placeholder="Notes about this task..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex gap-3">
          <Input
            id="start-val"
            label="Start"
            type="number"
            value={startValue}
            onChange={(e) => setStartValue(e.target.value)}
          />
          <Input
            id="end-val"
            label="Goal"
            type="number"
            value={endValue}
            onChange={(e) => setEndValue(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Color</label>
          <div className="flex gap-2">
            {LEGO_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="w-7 h-7 rounded-full transition-transform"
                style={{
                  backgroundColor: c,
                  transform: color === c ? "scale(1.2)" : "scale(1)",
                  boxShadow:
                    color === c ? "0 0 0 2px var(--foreground)" : "none",
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!title.trim() || loading}>
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
