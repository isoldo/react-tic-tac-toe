import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { removeCookie } from  "typescript-cookie";
import UsersList from "../Users/UsersList";
import { useUser } from "../../hooks/useUser";
import GameDetails from "../Games/GameDetails";
import GamesList from "../Games/GamesList";


export default function Dashboard() {
  const [logout, setLogout] = useState(false);
  const [navigateToLogin, setNavigateToLogin] = useState(false);
  const [selected, setSelected] = useState<"games"|"users">("games");
  const { id, token } = useUser();
  const [gameId, setGameId] = useState<number | null>(null);


  const get = async (url: string): Promise<Response> => {
    const request = new Request(url,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );
    const response = await fetch(request);
    return response;
  }
  const post = async (url: string, body: Record<string, unknown>): Promise<Response> => {
    const request = new Request(url,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type":"application/json"
        }
      }
    );
    const response = await fetch(request);
    return response;
  }

  useEffect(() => {
    if (logout) {
      removeCookie("login");
      setNavigateToLogin(true);
    }
  }, [logout])

  return(
    <>
    { navigateToLogin && <Navigate to="/login"/>}
    <div>
      <button onClick={() => { setLogout(true) }}>Logout</button>
    </div>
    {
      gameId && <GameDetails get={get} post={post} gameId={gameId} setGameId={setGameId}/>
      ||
      <>
        <div>
          <button onClick={() => setSelected("games")}>{selected === "games" ? "GAMES" : "Games"}</button>
          <button onClick={() => setSelected("users")}>{selected === "users" ? "USERS" : "Users"}</button>
        </div>
        <div>
          { (selected === "games") && <GamesList get={get} post={post} userId={id} setGameId={setGameId}/> || <UsersList get={get} post={post} />}
        </div>
      </>
    }
    </>
  );
}
