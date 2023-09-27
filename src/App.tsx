import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';
import { BrowserRouter, Routes, Route, Navigate, useLoaderData, createRoutesFromElements, createBrowserRouter, RouterProvider } from "react-router-dom";
import { getCookie } from  "typescript-cookie";
import GamesList from './components/Games/GamesList';
import UsersList from './components/Users/UsersList';
import Dashboard from './components/Dashboard/Dashboard';
import GameDetails from './components/Games/GameDetails';

function ProtectedRoute({ Component, ...rest }: any) {
  const cookie = getCookie("login");

  if (!cookie) {
    return <Navigate to="/login" replace />;
  }

  return <Component {...rest} />;
};

const RoutesJSX = (<>
  <Route path="/register" Component={RegisterForm}/>
  <Route path="/login" Component={LoginForm}/>
  <Route path="/" element={<ProtectedRoute Component={Dashboard}/>}/>
  </>
)

const routes = createRoutesFromElements(RoutesJSX);

const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
