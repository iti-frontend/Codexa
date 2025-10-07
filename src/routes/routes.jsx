import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AuthRoute from "./AuthRoute";
import Home from "../pages/Home/Home";
import Dashboard from "../pages/Dashboard";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export const router = createBrowserRouter([
  // Auth Pages
  {
    element: (
      <AuthRoute>
        <AuthLayout />
      </AuthRoute>
    ),
    children: [
      { path: "/login", element: <LoginForm /> },
      { path: "/register", element: <RegisterForm /> },
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
