import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Overview from "./component/Overview/Overview";
import Users from "./component/Users/Users";
import Login from "./component/Login/Login";
import Register from "./component/Register/Register";
import Books from "./component/Books/Books";
import Transactions from "./component/Transactions/Transactions";
import NotFound from "./component/NotFound/NotFound";
import UserProvider from "./contexts/UserContext";
import GuestRoute from "./component/GuestRoute/GuestRoute";
import ProtectedRoute from "./component/ProtectedRoute/ProtectedRoute";
import AuthLayout from "./component/AuthLayout/AuthLayout";
import BlankLayout from "./component/BlankLayout/BlankLayout";
import { Toaster } from "react-hot-toast";
import AnimatedThemeTogglerDemo from "./component/AnimatedThemeToggler/AnimatedThemeTogglerDemo";
const routes = createBrowserRouter([
  {
    path: "/login",
    element: (
      <GuestRoute>
        <AuthLayout />
      </GuestRoute>
    ),
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    path: "/register",
    element: (
      <GuestRoute>
        <AuthLayout />
      </GuestRoute>
    ),
    children: [
      {
        index: true,
        element: <Register />,
      },
    ],
  },
  {
    path: "/",
    element: <BlankLayout />,
    children: [
      {
        path: "/books",
        element: (
          <ProtectedRoute>
            <Books />
          </ProtectedRoute>
        ),
      },
      {
        path: "/transactions",
        element: (
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        ),
      },
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Overview />
          </ProtectedRoute>
        ),
      },
      {
        path: "/users",
        element: (
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: "/theme-demo",
        element: (
          <ProtectedRoute>
            <AnimatedThemeTogglerDemo />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

function App() {
  return (
    <UserProvider>
      <Toaster />
      <RouterProvider router={routes} />
    </UserProvider>
  );
}

export default App;
