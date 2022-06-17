import React from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import DriverDashboard from './pages/DriverDashboard'
import FooterComponent from "./components/clientComponents/FooterComponent";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationComponent from "./components/clientComponents/NavigationComponent";
import { useSelector } from "react-redux";
import SpinnerComponent from "./components/SpinnerComponent";

function App() {
    const user = useSelector((state) => state.auth.user);
    const { packages, isError, message, isSuccess, isLoading } = useSelector((state) => state.packages);
  
    return (
        <div className="App">
            <BrowserRouter>
                <NavigationComponent user={user} />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage message={message} user={user} packages={packages} isError={isError} isLoading={isLoading} isSuccess={isSuccess} />} />
                    <Route path="/dashboard/*" element={<Dashboard message={message} user={user} packages={packages} isError={isError} isLoading={isLoading} isSuccess={isSuccess} />} />
                    <Route path="/driverdashboard/*" element={<DriverDashboard message={message} user={user} packages={packages} isError={isError} isLoading={isLoading} isSuccess={isSuccess} />} />
                    <Route path="/admin/*" element={<Admin message={message} user={user} packages={packages} isError={isError} isLoading={isLoading} isSuccess={isSuccess} />} />

                </Routes>
                <FooterComponent />
            <ToastContainer />
            </BrowserRouter>
        </div>
    );
}

export default App;
