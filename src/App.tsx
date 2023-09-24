import './App.css';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getCookie } from  "typescript-cookie";

function Home() {
  return(<p>Blank home page</p>);
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
