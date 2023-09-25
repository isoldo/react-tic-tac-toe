import { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";
import React from "react";

const GAMES_PER_PAGE = 10;

interface BoardRow {
  row: [number, number, number];
}

interface User {
  id: number;
  username: string;
}

interface Game {
  id: number;
  board: [BoardRow, BoardRow, BoardRow];
  winner: User;
  first_player: User;
  second_player: User;
  created: string;
  status: "finished" | "open" | "progress"
}

interface GameTableRowProps {
  game: Game;
}

function GameTableRow({game}: GameTableRowProps) {
  const { id: userId } = useUser();
  const { id, first_player, second_player, status } = game;

  const currentUser = (userId === first_player.id) || (second_player?.id === userId);

  return (
    <div>
      {id} - {status}  - {currentUser ? "true" : "false"}
    </div>
  )
}

interface GameTableProps {
  games: Game[]
}

function GameTable({ games }: GameTableProps) {
  const rowProps = games.map((g) => {return { game: g}});
  console.debug({rowProps});

  return (
    <Table items={rowProps} rowComponent={GameTableRow}/>
  )
}

interface TableProps<T> {
  items: Array<T>;
  rowComponent: React.ComponentType<T>;
}

function Table<T extends {}>({items, rowComponent}: TableProps<T>): JSX.Element {
  return (
    <>
    {
      items.map((item, index) => {
        return (
          <div key={index}>
            {React.createElement(rowComponent, item, null)}
          </div>
        )
      })
    }
    </>
  )
}

export default function GamesList() {
  const { id, token } = useUser();
  const [url, setUrl] = useState<{ curr: string, next: string | null, prev: string | null}>({
    curr: `https://tictactoe.aboutdream.io/games/?limit=${GAMES_PER_PAGE}`,
    next: null,
    prev: null
  });
  const [page, setPage] = useState<number>();
  const [lastRequestedPage, setLastRequestedPage] = useState<number>();
  const [games, setGames] = useState<Game[]>();

  console.debug({page});

  const getGames = async(page: number, token: string) => {
    const request = new Request(url.curr,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );
    setLastRequestedPage(page);
    const response = await fetch(request);
    console.debug({response});
    const responseBody = await response.json();
    setGames(responseBody.results);
    setUrl({...url, next: responseBody.next, prev: responseBody.previous});
  }

  useEffect(() => {
    console.debug("useEffect[page, token]");
    if (!token) {
      console.warn("No token, page should not load");
      return;
    }
    if (page === undefined) {
      console.debug("Setting page");
      setPage(0);
    } else {
      console.debug({page});
      if (page !== lastRequestedPage) {
        console.debug({page, lastRequestedPage, token})
        getGames(page, token);
      } else {
        console.debug("Stopped request duplication")
      }
    }
  }, [page, token]);

  useEffect(() => {
    console.debug({games});
  }, [games]);

  const onPrevButtonClick = () => {
    if ((page !== undefined) && (page > 0)) {
      setPage(page-1);
    }
  }
  const onNextButtonClick = () => {
    console.debug("Next button clicked")
    if (page !== undefined) {
      console.debug("Should set page to", page+1);
      setPage(page+1);
    }
  }

  return (
    <>
      <div>
        { games && <GameTable games={games}/>}
        <button disabled={page===0} onClick={onPrevButtonClick}>Prev</button>
        <button onClick={onNextButtonClick}>Next</button>
      </div>
    </>
  )
}
