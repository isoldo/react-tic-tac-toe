import { useLoaderData } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { useEffect, useState } from "react";
import { ApiError, Board, Game, Status } from "../../types";
import "./GameDetails.css";

interface BoardRowLayoutProps {
  rowIndex: number;
  row: number[];
  idMap: Record<number, string>;
  canMakeMove: boolean;
  onMoveClick: (rowIndex: number, columnIndex: number) => void;
}

function BoardRowLayout({ row, idMap, canMakeMove, rowIndex, onMoveClick }: BoardRowLayoutProps) {
  return (
    <div className="row">
      {row.map( (field, index) => {
        console.log({field, rowIndex, index});
          return (
            <div className="column" key={index} onClick={() => onMoveClick(rowIndex, index)}>
              <input placeholder={idMap[field] ?? `. (${index})`} disabled={!canMakeMove || !!field}></input>
            </div>
          )
        })
      }
    </div>
  )
}

interface  BoardLayoutProps {
  canMakeMove: boolean;
  players: {
    firstPlayer: number;
    secondPlayer: number | undefined;
  }
  board: Board;
  marks?: {
    firstPlayer: string;
    secondPlayer: string;
  };
  onMoveClick: (rowIndex: number, columnIndex: number) => void;
}

function BoardLayout({ players, marks = {firstPlayer: "X", secondPlayer: "O"}, board, canMakeMove, onMoveClick }: BoardLayoutProps) {

  board.map((br) => console.debug({br}));

  const firstPlayer = players.firstPlayer;
  const secondPlayer = players.secondPlayer;
  const idMap = {
    [firstPlayer]: marks.firstPlayer,
    [secondPlayer ?? -1]: marks.secondPlayer
  }

  console.debug({idMap});

  return (
    <div>
      <p>The board:</p>
      {
        board.map((row, index) => {
          return (
              <div key={index}>
                <BoardRowLayout rowIndex={index} row={row} idMap={idMap} canMakeMove={canMakeMove} onMoveClick={onMoveClick}/>
              </div>
          );
        })
      }
    </div>
  )
}

function getGameStatusText(status: Status) {
  const statusTexts: Record<Status, string> = {
    "finished": "Finished",
    "open": "Open",
    "progress": "In progress"
  }

  return statusTexts[status];
}

export default function GameDetails() {
  const { id } = useLoaderData() as { id: number };
  const { id: userId, token } = useUser();
  const [currentGame, setCurrentGame] = useState<Game>();
  const [isUserParticipating, setIsUserParticipating] = useState(false);
  const [error, setError] = useState<string | null>();

  console.debug({ id });

  const getGame = async(id: number, token: string) => {
    const request = new Request(`https://tictactoe.aboutdream.io/games/${id}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );
    const response = await fetch(request);
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
    if (token && !!id) {
      getGame(id, token)
    }
  }, [id, token]);

  const onMoveClick = async (rowIndex: number, columnIndex: number) => {
    if (!currentGame) return;
    const request = new Request(`https://tictactoe.aboutdream.io/games/${id}/move/`,
      {
        method: "POST",
        body: JSON.stringify({row: rowIndex, col: columnIndex}),
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type":"application/json"
        }
      }
    );
    const response = await fetch(request);
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
  }

  // some of these conditions are redundant
  const canUserJoin = currentGame && currentGame.status === "open" && !currentGame.second_player && !isUserParticipating;

  const onJoinClick = async () => {
    if (canUserJoin) {
      const request = new Request(`https://tictactoe.aboutdream.io/games/${id}/join/`,
        {
          method: "POST",
          body: JSON.stringify({winner: "", first_player: currentGame.first_player.id, second_player: userId}),
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type":"application/json"
          }
        }
      );
      const response = await fetch(request);
      console.debug({response});
      try {
        const responseBody = await response.json();
        console.debug({responseBody});
      } catch (e) {
        console.error({e});
      }
    }
  }

  return (
    <div>
      <p>ID: {id}</p>
      {
        currentGame &&
        <>
          {
            canUserJoin && <button onClick={onJoinClick}>Join game</button>
          }
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
