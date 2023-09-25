import { Game } from "../../types";
import Table from "../Generic/Table";
import GameTableRow from "./GamesTableRow";

interface GameTableProps {
  games: Game[]
}

export default function GameTable({ games }: GameTableProps) {
  const rowProps = games.map((g) => {return { game: g}});
  console.debug({rowProps});

  return (
    <Table items={rowProps} rowComponent={GameTableRow}/>
  )
}
