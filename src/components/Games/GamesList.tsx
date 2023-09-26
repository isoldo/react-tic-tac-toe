import { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";
import GameTable from "./GamesTable";
import { Filter, FilterValues, Game } from "../../types";
import { gameStatusMapper } from "../../utils/gameStatusMapper";

const GAMES_PER_PAGE = 10;

interface Url {
  base: string;
  options: {
    curr: string | null;
    prev: string | null;
    next: string | null;
  }
}

export default function GamesList() {
  const { token } = useUser();
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
    const nextOptions = responseBody.next ? `?${(responseBody.next as string).split("?")[1]}` : null;
    const prevOptions = responseBody.previous ? `?${(responseBody.previous as string).split("?")[1]}` : null;
    setUrl({...url, options: { ...url.options, next: nextOptions, prev: prevOptions}});
  }

  useEffect(() => {
    console.debug("useEffect[url, token]");
    if (!token) {
      console.warn("No token, page should not load");
      return;
    }
    if (url.base === undefined) {
      console.debug("Current URL undefined", {url});
      return;
    } else {
      console.debug({url});
      const formedUrl = `${url.base}${url.options.curr ? `?${url.options.curr}`: ""}`
      if (formedUrl !== lastRequestedUrl) {
        console.debug({formedUrl, lastRequestedUrl, token})
        getGames(formedUrl, token);
      } else {
        console.debug("Stopped request duplication")
      }
    }
  }, [url, token]);

  useEffect(() => {
    console.debug({games});
  }, [games]);

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
    if (value === "All") {
      // remove status from options
      if (url.options.curr?.includes("status")) {
        const indexOfStatus = url.options.curr.indexOf("&status=");
        const substring = url.options.curr.slice(indexOfStatus);
        const clearedSubstring = substring.split("&")[2];
        const newOptions = `${url.options.curr.slice(0,indexOfStatus)}${clearedSubstring ?? ""}`;
        console.log({indexOfStatus, substring, clearedSubstring, newOptions})
        setUrl({...url, options: {...url.options, curr: newOptions}});
      }
    } else {
      let clearedOptions = url.options.curr;
      if (url.options.curr?.includes("status")) {
        const indexOfStatus = url.options.curr.indexOf("&status=");
        const substring = url.options.curr.slice(indexOfStatus);
        const clearedSubstring = substring.split("&")[2];
        clearedOptions = `${url.options.curr.slice(0,indexOfStatus)}${clearedSubstring ?? ""}`;
      }
      setUrl({...url, options: { ...url.options, curr: `${clearedOptions ?? ""}&status=${gameStatusMapper[value]}`}})
    }
  }

  return (
    <>
      <div>
        <select name="status" id="game-status" onChange={(e) => onFilterSelect(e.target.value as Filter)}>
          {FilterValues.map((filterValue, index) => {
            return(
              <option key={index} value={filterValue}>{filterValue}</option>
            )
          })}
        </select>
        { games && <GameTable games={games}/>}
        <button disabled={!url.options.prev} onClick={onPrevButtonClick}>Prev</button>
        <button disabled={!url.options.next} onClick={onNextButtonClick}>Next</button>
      </div>
    </>
  )
}
