import { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";
import GameTable from "./GamesTable";

const GAMES_PER_PAGE = 10;

interface BoardRow {
  row: [number, number, number];
}

interface User {
  id: number;
  username: string;
}

export interface Game {
  id: number;
  board: [BoardRow, BoardRow, BoardRow];
  winner: User;
  first_player: User;
  second_player: User;
  created: string;
  status: "finished" | "open" | "progress"
}

export default function GamesList() {
  const { token } = useUser();
  const [url, setUrl] = useState<{ curr: string, next: string | null, prev: string | null}>({
    curr: `https://tictactoe.aboutdream.io/games/?limit=${GAMES_PER_PAGE}`,
    next: null,
    prev: null
  });
  const [lastRequestedUrl, setLastRequestedUrl] = useState<string>();
  const [games, setGames] = useState<Game[]>();

  const getGames = async(requestUrl: string, token: string) => {
    const request = new Request(requestUrl,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
      );
    const response = await fetch(request);
    setLastRequestedUrl(requestUrl);
    console.debug({response});
    const responseBody = await response.json();
    setGames(responseBody.results);
    const nextUrl = responseBody.next ? (responseBody.next as string).replace("http", "https") : null;
    const prevUrl = responseBody.previous ? (responseBody.previous as string).replace("http", "https") : null;
    setUrl({...url, next: nextUrl, prev: prevUrl});
  }

  useEffect(() => {
    console.debug("useEffect[url, token]");
    if (!token) {
      console.warn("No token, page should not load");
      return;
    }
    if (url.curr === undefined) {
      console.debug("Current URL undefined", {url});
      return;
    } else {
      console.debug({url});
      if (url.curr !== lastRequestedUrl) {
        console.debug({curr: url.curr, lastRequestedUrl, token})
        getGames(url.curr, token);
      } else {
        console.debug("Stopped request duplication")
      }
    }
  }, [url, token]);

  useEffect(() => {
    console.debug({games});
  }, [games]);

  const onPrevButtonClick = () => {
    if (url.prev) {
      setUrl({...url, curr: url.prev});
    }
  }

  const onNextButtonClick = () => {
    console.debug("NEXT clicked", {url});
    if (url.next) {
      setUrl({...url, curr: url.next});
    }
  }

  return (
    <>
      <div>
        { games && <GameTable games={games}/>}
        <button disabled={!url.prev} onClick={onPrevButtonClick}>Prev</button>
        <button disabled={!url.next} onClick={onNextButtonClick}>Next</button>
      </div>
    </>
  )
}
