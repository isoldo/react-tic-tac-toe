import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { Game } from "../../types";

interface GameTableRowProps {
  game: Game;
}

export default function GameTableRow({game}: GameTableRowProps) {
  const { id: userId } = useUser();
  const { id, first_player, second_player, status } = game;
  const navigate = useNavigate();

  const currentUser = (userId === first_player.id) || (second_player?.id === userId);

  const onGameClick = () => {navigate(`/games/${id}`)};
  return (
    <div onClick={onGameClick}>
      {id} - {status}  - {currentUser ? "true" : "false"}
    </div>
  )
}
