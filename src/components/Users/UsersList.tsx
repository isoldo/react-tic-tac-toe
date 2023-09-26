import { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";
import UserTable from "./UserTable";
import { Url, UserData } from "../../types";

const USERS_PER_PAGE = 10;

export default function UsersList() {
  const { token } = useUser();
  const [url, setUrl] = useState<Url>({
    base: `https://tictactoe.aboutdream.io/users/`,
    options: {
      curr: `limit=${USERS_PER_PAGE}`,
      prev: null,
      next: null
    }
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
        getUsers(formedUrl, token);
      } else {
        console.debug("Stopped request duplication")
      }
    }
  }, [url, token]);

  useEffect(() => {
    console.debug({users});
  }, [users]);

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

  return (
    <div>
      { users && <UserTable users={users}/>}
      <button disabled={!url.options.prev} onClick={onPrevButtonClick}>Previous</button>
      <button disabled={!url.options.next} onClick={onNextButtonClick}>Next</button>
    </div>
  )
}
