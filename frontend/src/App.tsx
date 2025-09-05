// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoutes";

import DashboardPage from "./pages/DashboardPage";
import MyContentPage from "./pages/MyItems";
import CategoriesPage from "./pages/Categories";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import AddContentPage from "./pages/AddContentPage";

export default function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/my" element={<MyContentPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/add-content" element={<AddContentPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
