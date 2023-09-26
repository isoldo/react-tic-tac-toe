export interface User {
  id: number;
  username: string;
}

export interface UserData {
  id: number;
  username: string;
  game_count: number;
  win_rate: number;
}

export type BoardRow = number[];
export type Board = [BoardRow, BoardRow, BoardRow];

export const FilterValues = ["All", "Open", "In progress", "Finished"] as const;
export type Filter = typeof FilterValues[number];

export interface Url {
  base: string;
  options: {
    curr: string | null;
    prev: string | null;
    next: string | null;
  }
}

export type Status = "finished" | "open" | "progress";

export interface Game {
  id: number;
  board: Board;
  winner: User | null;
  first_player: User;
  second_player: User | null;
  created: string;
  status: Status;
}

export interface ApiError {
  code: string;
  message: string;
  path: string;
}
