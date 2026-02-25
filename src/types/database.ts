export interface Room {
  id: string;
  code: string;
  name: string;
  created_at: string;
}

export interface Task {
  id: string;
  room_id: string;
  title: string;
  description: string;
  start_value: number;
  end_value: number;
  current_value: number;
  created_by: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface ProgressEntry {
  id: string;
  task_id: string;
  previous_value: number;
  new_value: number;
  added_by: string;
  created_at: string;
}
