import { useLoaderData } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { useEffect, useState } from "react";
import { Board, Game } from "../../types";

interface BoardRowLayoutProps {
  row: number[];
  idMap: Record<number, string>;
}

function BoardRowLayout({ row, idMap }: BoardRowLayoutProps) {
  return (
    <div>
      {idMap[row[0]] ?? "."} {idMap[row[1]] ?? "."} {idMap[row[2]] ?? "."}
    </div>
  )
}

interface  BoardLayoutProps {
  players: {
    firstPlayer: number;
    secondPlayer: number;
  }
  board: Board;
  marks: {
    firstPlayer: string;
    secondPlayer: string;
  }
}

function BoardLayout({ players, marks, board }: BoardLayoutProps) {

  board.map((br) => console.debug({br}));

  const firstPlayer = players.firstPlayer;
  const secondPlayer = players.secondPlayer;
  const idMap = {
    [firstPlayer]: marks.firstPlayer,
    [secondPlayer]: marks.secondPlayer
  }

  console.debug({idMap})

  return (
    <>
    {
      board.map(row => {
        return (
          <>
            <BoardRowLayout row={row} idMap={idMap}/>
          </>
        );
      })
    }
    </>
  )
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
      { currentGame &&
        <p>Created at ${currentGame.created}</p>
      }
      { currentGame?.board &&
        <div>
          <BoardLayout
            board={currentGame.board}
            players={{firstPlayer: currentGame.first_player.id, secondPlayer: currentGame.second_player.id}}
            marks={{firstPlayer: "X", secondPlayer: "O"}} />
        </div>
      }
    </div>
  )
}
