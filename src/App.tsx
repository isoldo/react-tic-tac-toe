import './App.css';
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
