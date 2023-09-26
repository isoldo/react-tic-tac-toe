import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { removeCookie } from  "typescript-cookie";
import GamesList from "../Games/GamesList";
import UsersList from "../Users/UsersList";


export default function Dashboard() {
  const [logout, setLogout] = useState(false);
  const [navigateToLogin, setNavigateToLogin] = useState(false);
  const [selected, setSelected] = useState<"games"|"users">("games")

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
    <div>
      <button onClick={() => setSelected("games")}>Games</button>
      <button onClick={() => setSelected("users")}>Users</button>
    </div>
    <div>
      { (selected === "games") && <GamesList /> || <UsersList />}
    </div>
    </>
  );
}
