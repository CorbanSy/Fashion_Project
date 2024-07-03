import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import './styles/App.css';

function App({ isLoggedIn, onLogout}) {
    return (
        <div className="app">
            <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />
            <Outlet />
        </div>
    );
}

export default App;
