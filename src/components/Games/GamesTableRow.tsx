import { useUser } from "../../hooks/useUser";
import { Game } from "../../types";

interface GameTableRowProps {
  game: Game;
  setGameId: (id: number) => void;
}

export default function GameTableRow({game, setGameId}: GameTableRowProps) {
  const { id: userId } = useUser();
  const { id, first_player, second_player, status } = game;

  const currentUser = (userId === first_player.id) || (second_player?.id === userId);

  const onGameClick = () => setGameId(id);
  return (
    <div onClick={onGameClick}>
      {id} - {status}  - {currentUser ? "true" : "false"}
    </div>
  )
}
