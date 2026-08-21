import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { getUser } from "./services/authApi";
import Hero from "./pages/Hero/Hero";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";

function AppShell() {
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);
  const [dashboardNavbar, setDashboardNavbar] = useState(null);
  const isDashboard = location.pathname === "/dashboard";

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    getUser().then((response) => setUserInfo(response.data?.user || null)).catch(() => setUserInfo(null));
  }, []);

  const activeUser = dashboardNavbar?.userInfo || userInfo;

  return (
    <div className="app">
      <Navbar
        userInfo={activeUser}
        onSearchNote={isDashboard ? dashboardNavbar?.onSearchNote : undefined}
        handleClearSearch={isDashboard ? dashboardNavbar?.handleClearSearch : undefined}
        onOpenProfile={dashboardNavbar?.onOpenProfile}
      />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route element={<ProtectedRoute />}><Route path="/dashboard" element={<Home onNavbarChange={setDashboardNavbar} />} /></Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return <Router><AppShell /></Router>;
}
