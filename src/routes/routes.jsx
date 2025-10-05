import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AuthRoute from "./AuthRoute";
import Home from "../pages/Home/Home";
import Dashboard from "../pages/Dashboard";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";

export const router = createBrowserRouter([
  // Auth Pages
  {
    element: (
      <AuthRoute>
        <AuthLayout />
      </AuthRoute>
    ),
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },

  // App Pages
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "/dashboard", element: <Dashboard /> },
    ],
  },
]);
