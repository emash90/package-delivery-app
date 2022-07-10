import { useEffect } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import DriverDashboard from "./pages/DriverDashboard";
import FooterComponent from "./components/clientComponents/FooterComponent";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationComponent from "./components/clientComponents/NavigationComponent";
import { useSelector } from "react-redux";
import SpinnerComponent from "./components/SpinnerComponent";
import io from "socket.io-client";

const socket = io.connect("https://package-delivery-project.herokuapp.com/");

function App() {
    const { user, allUsers } = useSelector((state) => state.auth);
    const { allDeliveries, deliveries, oneDelivery } = useSelector(
        (state) => state.deliveries
    );
    const {
        allPackages,
        onePackage,
        packages,
        isError,
        message,
        isSuccess,
        isLoading,
    } = useSelector((state) => state.packages);
    return (
        <div className="App">
            <BrowserRouter>
                <NavigationComponent user={user} />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/register"
                        element={
                            <RegisterPage
                                message={message}
                                user={user}
                                packages={packages}
                                isError={isError}
                                isLoading={isLoading}
                                isSuccess={isSuccess}
                            />
                        }
                    />
                    <Route
                        path="/dashboard/*"
                        element={
                            <Dashboard
                                message={message}
                                user={user}
                                packages={packages}
                                isError={isError}
                                isLoading={isLoading}
                                isSuccess={isSuccess}
                            />
                        }
                    />
                    <Route
                        path="/driverdashboard/*"
                        element={
                            <DriverDashboard
                                message={message}
                                user={user}
                                allPackages={allPackages}
                                onePackage={onePackage}
                                isError={isError}
                                isLoading={isLoading}
                                isSuccess={isSuccess}
                                deliveries={deliveries}
                                oneDelivery={oneDelivery}
                            />
                        }
                    />
                    <Route
                        path="/admin/*"
                        element={
                            <Admin
                                message={message}
                                user={user}
                                allUsers={allUsers}
                                isError={isError}
                                isLoading={isLoading}
                                isSuccess={isSuccess}
                                allPackages={allPackages}
                                onePackage={onePackage}
                                allDeliveries={allDeliveries}
                                oneDelivery={oneDelivery}
                            />
                        }
                    />
                </Routes>
                <FooterComponent />
                <ToastContainer />
            </BrowserRouter>
        </div>
    );
}

export default App;
