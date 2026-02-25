"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase/client";
import { Room, Task } from "@/types/database";
import { getUserName, setUserName as storeUserName } from "@/lib/utils";

interface RoomContextType {
  room: Room;
  tasks: Task[];
  userName: string | null;
  setUserName: (name: string) => void;
  refreshTasks: () => Promise<void>;
  updateTaskOptimistic: (taskId: string, updates: Partial<Task>) => void;
  removeTask: (taskId: string) => void;
}

const RoomContext = createContext<RoomContextType | null>(null);

export function useRoom() {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error("useRoom must be used within RoomProvider");
  return ctx;
}

interface RoomProviderProps {
  room: Room;
  initialTasks: Task[];
  children: ReactNode;
}

export default function RoomProvider({
  room,
  initialTasks,
  children,
}: RoomProviderProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [userName, setUserNameState] = useState<string | null>(null);

  useEffect(() => {
    const stored = getUserName(room.code);
    if (stored) setUserNameState(stored);
    // Remember this room so the homepage can auto-redirect
    localStorage.setItem("buildtogether_last_room", room.code);
  }, [room.code]);

  const setUserName = useCallback(
    (name: string) => {
      storeUserName(room.code, name);
      setUserNameState(name);
    },
    [room.code]
  );

  const refreshTasks = useCallback(async () => {
    const res = await fetch(`/api/rooms/${room.code}`);
    if (res.ok) {
      const data = await res.json();
      setTasks(data.tasks);
    }
  }, [room.code]);

  const updateTaskOptimistic = useCallback(
    (taskId: string, updates: Partial<Task>) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
      );
    },
    []
  );

  const removeTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  // Realtime subscriptions
  useEffect(() => {
    const tasksChannel = supabase
      .channel(`tasks-${room.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `room_id=eq.${room.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTasks((prev) => {
              if (prev.some((t) => t.id === (payload.new as Task).id)) return prev;
              return [...prev, payload.new as Task];
            });
          } else if (payload.eventType === "UPDATE") {
            setTasks((prev) =>
              prev.map((t) =>
                t.id === (payload.new as Task).id ? (payload.new as Task) : t
              )
            );
          } else if (payload.eventType === "DELETE") {
            setTasks((prev) =>
              prev.filter((t) => t.id !== (payload.old as { id: string }).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(tasksChannel);
    };
  }, [room.id]);

  return (
    <RoomContext.Provider
      value={{
        room,
        tasks,
        userName,
        setUserName,
        refreshTasks,
        updateTaskOptimistic,
        removeTask,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}
