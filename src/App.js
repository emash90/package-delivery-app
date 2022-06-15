import React from "react";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import FooterComponent from "./components/FooterComponent";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationComponent from "./components/NavigationComponent";


function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <NavigationComponent />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard/*" element={<Dashboard />} />
                </Routes>
                <FooterComponent />
            </BrowserRouter>
        </div>
    );
}

export default App;
