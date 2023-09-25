import { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";

const USERS_PER_PAGE = 10;

interface UserData {
  id: number;
  username: string;
  game_count: number;
  win_rate: number;
}

export default function UsersList() {
  const { token } = useUser();
  const [url, setUrl] = useState<{ curr: string, next: string | null, prev: string | null}>({
    curr: `https://tictactoe.aboutdream.io/users/?limit=${USERS_PER_PAGE}`,
    next: null,
    prev: null
  });
  const [lastRequestedUrl, setLastRequestedUrl] = useState<string>();
  const [users, setUsers] = useState<UserData[]>();

  const getUsers = async (requestUrl: string, token: string) => {
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
    setUsers(responseBody.results);
    // API returns wrong URLs
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
        getUsers(url.curr, token);
      } else {
        console.debug("Stopped request duplication")
      }
    }
  }, [url, token]);

  useEffect(() => {
    console.debug({users});
  }, [users]);

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
    <div>
      <button disabled={!url.prev} onClick={onPrevButtonClick}>Previous</button>
      <button disabled={!url.next} onClick={onNextButtonClick}>Next</button>
    </div>
  )
}
