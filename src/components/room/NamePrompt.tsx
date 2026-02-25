"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useRoom } from "./RoomProvider";

export default function NamePrompt() {
  const { userName, setUserName } = useRoom();
  const [name, setName] = useState("");

  if (userName) return null;

  return (
    <Modal open={!userName} onClose={() => {}} title="What's your name?">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) setUserName(name.trim());
        }}
      >
        <Input
          id="name"
          placeholder="Enter your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <div className="mt-4 flex justify-end">
          <Button type="submit" disabled={!name.trim()}>
            Join Room
          </Button>
        </div>
      </form>
    </Modal>
  );
}
