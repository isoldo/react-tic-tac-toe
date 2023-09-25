import { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getCookie, removeCookie } from  "typescript-cookie";
import GamesList from './components/Games/GamesList';

function Home() {
  const [logout, setLogout] = useState(false);
  const [navigateToLogin, setNavigateToLogin] = useState(false);

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
    </>
  );
}

function ProtectedRoute({ Component, ...rest }: any) {
  const cookie = getCookie("login");

  if (!cookie) {
    return <Navigate to="/login" replace />;
  }

  return <Component {...rest} />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" Component={RegisterForm}/>
        <Route path="/login" Component={LoginForm}/>
        <Route path="/" element={<ProtectedRoute Component={Home}/>}/>
        <Route path="/games" element={<ProtectedRoute Component={GamesList}/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
