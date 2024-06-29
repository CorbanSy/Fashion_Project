import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UploadOutfit from "./pages/UploadOutfit";
import OutfitRecommendations from "./pages/OutfitRecommendations";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Router>
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="upload" element={<ProtectedRoute><UploadOutfit /></ProtectedRoute>} />
                <Route path="outfits/:outfitId/recommendations" element={<ProtectedRoute><OutfitRecommendations /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    </Router>
);
