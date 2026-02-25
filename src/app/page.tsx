"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const LAST_ROOM_KEY = "buildtogether_last_room";

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<"idle" | "create" | "join">("idle");
  const [roomName, setRoomName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  // Auto-redirect to last visited room
  useEffect(() => {
    const lastRoom = localStorage.getItem(LAST_ROOM_KEY);
    if (lastRoom) {
      router.replace(`/room/${lastRoom}`);
    } else {
      setChecking(false);
    }
  }, [router]);

  const createRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: roomName.trim() }),
      });

      if (!res.ok) throw new Error("Failed to create room");
      const room = await res.json();
      localStorage.setItem(LAST_ROOM_KEY, room.code);
      router.push(`/room/${room.code}`);
    } catch {
      setError("Failed to create room. Please try again.");
      setLoading(false);
    }
  };

  const joinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/rooms/${joinCode.trim()}`);
      if (!res.ok) throw new Error("Room not found");
      localStorage.setItem(LAST_ROOM_KEY, joinCode.trim());
      router.push(`/room/${joinCode.trim()}`);
    } catch {
      setError("Room not found. Check the code and try again.");
      setLoading(false);
    }
  };

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center p-4" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">BuildTogether</h1>
          <p className="text-[var(--muted)]">
            Track goals with your accountability partner.
            <br />
            Watch your progress stack up, brick by brick.
          </p>
        </div>

        {mode === "idle" && (
          <div className="flex flex-col gap-3">
            <Button size="lg" className="w-full" onClick={() => setMode("create")}>
              Create a Room
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="w-full"
              onClick={() => setMode("join")}
            >
              Join a Room
            </Button>
          </div>
        )}

        {mode === "create" && (
          <form onSubmit={createRoom} className="flex flex-col gap-4">
            <Input
              id="room-name"
              label="Room Name"
              placeholder="e.g., Study Buddies"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              autoFocus
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setMode("idle");
                  setError("");
                }}
              >
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={loading || !roomName.trim()}>
                {loading ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        )}

        {mode === "join" && (
          <form onSubmit={joinRoom} className="flex flex-col gap-4">
            <Input
              id="room-code"
              label="Room Code"
              placeholder="Enter 8-character code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              autoFocus
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setMode("idle");
                  setError("");
                }}
              >
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={loading || !joinCode.trim()}>
                {loading ? "Joining..." : "Join"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
