import { useEffect, useState } from "react";
import GameTable from "./GamesTable";
import { Filter, FilterValues, Game, Url } from "../../types";
import { gameStatusMapper } from "../../utils/gameStatusMapper";

const GAMES_PER_PAGE = 10;

interface GameListProps {
  userId: number | null;
  get: (url: string) => Promise<Response>;
  post: (url: string, body: Record<string, unknown>) => Promise<Response>;
  setGameId: (id: number | null) => void;
}

export default function GamesList({ get, post, setGameId, userId }: GameListProps) {
  const [url, setUrl] = useState<Url>({
    base: `https://tictactoe.aboutdream.io/games/`,
    options: {
      curr: `limit=${GAMES_PER_PAGE}`,
      prev: null,
      next: null
    }
  });
  const [lastRequestedUrl, setLastRequestedUrl] = useState<string>();
  const [games, setGames] = useState<Game[]>();
  const [creatingGame, setCreatingGame] = useState(false);

  const getGames = async(requestUrl: string) => {
    const response = await get(requestUrl);
    setLastRequestedUrl(requestUrl);
    const responseBody = await response.json();
    setGames(responseBody.results);
    const nextOptions = responseBody.next ? `?${(responseBody.next as string).split("?")[1]}` : null;
    const prevOptions = responseBody.previous ? `?${(responseBody.previous as string).split("?")[1]}` : null;
    setUrl({...url, options: { ...url.options, next: nextOptions, prev: prevOptions}});
  }

  useEffect(() => {
    if (url.base === undefined) {
      return;
    } else {
      const formedUrl = `${url.base}${url.options.curr ? `?${url.options.curr}`: ""}`
      if (formedUrl !== lastRequestedUrl) {
        getGames(formedUrl);
      }
    }
  }, [url]);

  const onPrevButtonClick = () => {
    if (url.options.prev) {
      setUrl({...url, options: { ...url.options, curr: url.options.prev}});
    }
  }

  const onNextButtonClick = () => {
    if (url.options.next) {
      setUrl({...url, options: { ...url.options, curr: url.options.next}});
    }
  }

  const onFilterSelect = (value: Filter) => {
    let clearedOptions = url.options.curr;
    const indexOfStatus = url.options.curr?.indexOf("&status=");
    if (indexOfStatus !== -1) {
      const substring = url.options.curr?.slice(indexOfStatus);
      const clearedSubstring = substring?.split("&")[2];
      clearedOptions = `${url.options.curr?.slice(0,indexOfStatus)}${clearedSubstring ?? ""}`;
    }
    if (value === "All") {
      setUrl({...url, options: {...url.options, curr: clearedOptions}});
    } else {
      setUrl({...url, options: { ...url.options, curr: `${clearedOptions ?? ""}&status=${gameStatusMapper[value]}`}})
    }
  }

  const onNewGameClick = async () => {
    setCreatingGame(true);
    const response = await post("https://tictactoe.aboutdream.io/games/", {});
    setCreatingGame(false);
    const _responseBody = await response.json();
    // when creating a new game, reset the filter (request the inital URL). Clear last requested URL to hinder double request prevention
    setLastRequestedUrl(undefined);
    onFilterSelect("All");
  }

  return (
    <>
      <div>
        <div>
          <button disabled={creatingGame} onClick={onNewGameClick}>{creatingGame ? "Creating..." : "New game"}</button>
        </div>
        <select name="status" id="game-status" onChange={(e) => onFilterSelect(e.target.value as Filter)}>
          {FilterValues.map((filterValue, index) => {
            return(
              <option key={index} value={filterValue}>{filterValue}</option>
            )
          })}
        </select>
        { games && <GameTable games={games} setGameId={setGameId} userId={userId}/>}
        <button disabled={!url.options.prev} onClick={onPrevButtonClick}>Prev</button>
        <button disabled={!url.options.next} onClick={onNextButtonClick}>Next</button>
      </div>
    </>
  )
}
