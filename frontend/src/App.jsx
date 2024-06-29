import React from "react";
import { Outlet } from "react-router-dom";

function App() {
    return (
        <div className="app">
            <h1>Fashion Recommendation System</h1>
            <Outlet />
        </div>
    );
}

export default App;
