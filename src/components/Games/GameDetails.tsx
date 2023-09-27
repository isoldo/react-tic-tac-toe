import { useUser } from "../../hooks/useUser";
import { useEffect, useState } from "react";
import { ApiError, Game, Status } from "../../types";
import "./GameDetails.css";
import BoardLayout from "../Board/BoardLayout";

function getGameStatusText(status: Status) {
  const statusTexts: Record<Status, string> = {
    "finished": "Finished",
    "open": "Open",
    "progress": "In progress"
  }

  return statusTexts[status];
}

interface GameDetailsProps {
  get: (url: string) => Promise<Response>;
  post: (url: string, body: Record<string, unknown>) => Promise<Response>;
  gameId: number;
  setGameId: (id: number | null) => void;
}

export default function GameDetails({ get, post, gameId, setGameId }: GameDetailsProps) {
  const { id: userId } = useUser();
  const [currentGame, setCurrentGame] = useState<Game>();
  const [isUserParticipating, setIsUserParticipating] = useState(false);
  const [error, setError] = useState<string | null>();
  const [reload, setReload] = useState(true);

  console.debug({ gameId });

  const getGame = async(id: number) => {
    const response = await get(`https://tictactoe.aboutdream.io/games/${id}`);
    console.debug({response});
    const responseBody = await response.json();
    console.debug({responseBody});
    const game: Game = responseBody;
    console.debug({game});
    setCurrentGame(game);
  }

  useEffect(() => {
    if (userId && currentGame) {
      if ([currentGame.first_player.id, currentGame.second_player?.id].includes(userId)) {
        console.debug({userId})
        setIsUserParticipating(true);
      }
    }
  }, [userId, currentGame]);

  useEffect(() => {
    if (!!gameId && reload) {
      getGame(gameId);
      setReload(false);
    }
  }, [gameId, reload]);

  const onMoveClick = async (rowIndex: number, columnIndex: number) => {
    if (!currentGame) return;
    const response = await post(`https://tictactoe.aboutdream.io/games/${gameId}/move/`, {row: rowIndex, col: columnIndex});
    console.debug({response});
    try {
      const responseBody = await response.json();
      console.debug({responseBody});
      if (responseBody.errors.length) {
        const errors: ApiError[] = responseBody.errors;
        setError(errors[0].message);
      }
    } catch (e) {
      console.error({e});
    }
    setReload(true);
  }

  // some of these conditions are redundant
  const canUserJoin = currentGame && currentGame.status === "open" && !currentGame.second_player && !isUserParticipating;

  const onJoinClick = async () => {
    if (canUserJoin) {
      const requestBody = {winner: "", first_player: currentGame.first_player.id};
      const response = await post(`https://tictactoe.aboutdream.io/games/${gameId}/join/`, requestBody);
      console.debug({response});
      try {
        const responseBody = await response.json();
        console.debug({responseBody});
      } catch (e) {
        console.error({e});
      }
      setReload(true);
    }
  }

  return (
    <div>
      <p>ID: {gameId}</p>
      {
        currentGame &&
        <>
          {
            canUserJoin && <button onClick={onJoinClick}>Join game</button>
          }
          <button onClick={() => setGameId(null)}>Back</button>
          <p>Created at {(new Date(currentGame.created)).toLocaleString()}</p>
          <p>Status: {getGameStatusText(currentGame.status)}</p>
          <p>First player: {currentGame.first_player.username}</p>
          <p>Second player: {currentGame.second_player?.username ?? "Waiting for player"}</p>
          { currentGame.board &&
            <div>
              <BoardLayout
                board={currentGame.board}
                players={{firstPlayer: currentGame.first_player.id, secondPlayer: currentGame.second_player?.id}}
                canMakeMove={isUserParticipating}
                onMoveClick={onMoveClick}/>
            </div>
          }
          {
            !!error &&
            <div style={{color: "red"}}>
              {error}
            </div>
          }
        </>
      }
    </div>
  )
}
