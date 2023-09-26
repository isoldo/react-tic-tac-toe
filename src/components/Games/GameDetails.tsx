import { useLoaderData } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { useEffect, useState } from "react";
import { Board, Game, Status } from "../../types";
import "./GameDetails.css";

interface BoardRowLayoutProps {
  row: number[];
  idMap: Record<number, string>;
}

function BoardRowLayout({ row, idMap }: BoardRowLayoutProps) {
  return (
    <div className="row">
      {row.map( (field, index) => {
          return (
            <div className="column" key={index}>
              {/* {idMap[field] ?? "."} */}
              <input placeholder={idMap[field ?? "."]} disabled={!!field}></input>
            </div>
          )
        })
      }
    </div>
  )
}

interface  BoardLayoutProps {
  players: {
    firstPlayer: number;
    secondPlayer: number | undefined;
  }
  board: Board;
  marks?: {
    firstPlayer: string;
    secondPlayer: string;
  }
}

function BoardLayout({ players, marks = {firstPlayer: "X", secondPlayer: "O"}, board }: BoardLayoutProps) {

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
                <BoardRowLayout row={row} idMap={idMap}/>
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
  const { token } = useUser();
  const [currentGame, setCurrentGame] = useState<Game>();

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
    if (token && !!id) {
      getGame(id, token)
    }
  }, [id, token]);

  return (
    <div>
      <p>ID: {id}</p>
      {
        currentGame &&
        <>
          <p>Created at {(new Date(currentGame.created)).toLocaleString()}</p>
          <p>Status: {getGameStatusText(currentGame.status)}</p>
          <p>First player: {currentGame.first_player.username}</p>
          <p>Second player: {currentGame.second_player?.username ?? "Waiting for player"}</p>
          { currentGame.board &&
            <div>
              <BoardLayout
                board={currentGame.board}
                players={{firstPlayer: currentGame.first_player.id, secondPlayer: currentGame.second_player?.id}} />
            </div>
          }
        </>
      }
    </div>
  )
}
