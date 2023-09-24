import './App.css';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function Home() {
  return(<p>Blank home page</p>);
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home}/>
        <Route path="/register" Component={RegisterForm}/>
        <Route path="/login" Component={LoginForm}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
