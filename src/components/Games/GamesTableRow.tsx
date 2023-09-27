import { Game } from "../../types";

interface GameTableRowProps {
  game: Game;
  userId: number | null;
  setGameId: (id: number) => void;
}

export default function GameTableRow({game, setGameId, userId}: GameTableRowProps) {
  const { id, first_player, second_player, status } = game;

  const currentUser = (userId === first_player.id) || (second_player?.id === userId);

  const onGameClick = () => setGameId(id);
  return (
    <div onClick={onGameClick}>
      {id} - {status}  - {currentUser ? "You are participating" : "You are not participating"}
    </div>
  )
}
