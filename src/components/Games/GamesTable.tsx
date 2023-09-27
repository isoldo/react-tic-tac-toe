import { Game } from "../../types";
import Table from "../Generic/Table";
import GameTableRow from "./GamesTableRow";

interface GameTableProps {
  games: Game[];
  setGameId: (id: number) => void;
}

export default function GameTable({ games, setGameId }: GameTableProps) {
  const rowProps = games.map((g) => {return { game: g, setGameId}});
  console.debug({rowProps});

  return (
    <Table items={rowProps} rowComponent={GameTableRow}/>
  )
}
