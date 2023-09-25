import { useUser } from "../../hooks/useUser";
import { Game } from "../../types";

interface GameTableRowProps {
  game: Game;
}

export default function GameTableRow({game}: GameTableRowProps) {
  const { id: userId } = useUser();
  const { id, first_player, second_player, status } = game;

  const currentUser = (userId === first_player.id) || (second_player?.id === userId);

  return (
    <div>
      {id} - {status}  - {currentUser ? "true" : "false"}
    </div>
  )
}
