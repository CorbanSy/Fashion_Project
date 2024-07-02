import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UploadOutfit from "./pages/UploadOutfit";
import OutfitRecommendations from "./pages/OutfitRecommendations";
import NotFound from "./pages/NotFound";
import VirtualCloset from "./pages/VirtualCloset";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/index.css";

function Main() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('accress_token');
        localStorage.removeItem('refresh_token');
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<App isLoggedIn={isLoggedIn} onLogout={handleLogout}/>}>
                    <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="rate-outfit" element={<ProtectedRoute><UploadOutfit /></ProtectedRoute>} />
                    <Route path="outfits/:outfitId/recommendations" element={<ProtectedRoute><OutfitRecommendations /></ProtectedRoute>} />
                    <Route path="virtual-closet" element={<ProtectedRoute><VirtualCloset /></ProtectedRoute>}/>
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
    </Router>
    )
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Main />);
