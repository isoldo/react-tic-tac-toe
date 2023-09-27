import { Game } from "../../types";
import Table from "../Generic/Table";
import GameTableRow from "./GamesTableRow";

interface GameTableProps {
  games: Game[];
  setGameId: (id: number) => void;
  userId: number | null;
}

export default function GameTable({ games, setGameId, userId }: GameTableProps) {
  const rowProps = games.map((g) => {return { game: g, setGameId, userId}});

  return (
    <Table items={rowProps} rowComponent={GameTableRow}/>
  )
}
