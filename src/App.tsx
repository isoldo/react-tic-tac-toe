import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getCookie } from  "typescript-cookie";
import GamesList from './components/Games/GamesList';
import UsersList from './components/Users/UsersList';
import Dashboard from './components/Dashboard/Dashboard';

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
        <Route path="/" element={<ProtectedRoute Component={Dashboard}/>}/>
        <Route path="/games" element={<ProtectedRoute Component={GamesList}/>}/>
        <Route path="/users" element={<ProtectedRoute Component={UsersList}/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
