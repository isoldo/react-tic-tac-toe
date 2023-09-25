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

export interface BoardRow {
  row: [number, number, number];
}

export interface Game {
  id: number;
  board: [BoardRow, BoardRow, BoardRow];
  winner: User;
  first_player: User;
  second_player: User;
  created: string;
  status: "finished" | "open" | "progress"
}
