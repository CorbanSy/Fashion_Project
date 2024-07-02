import React from 'react';
import { Link, useNavigate} from 'react-router-dom';
import "../styles/Navbar.css";

function Navbar({ isLoggedIn, onLogout}) {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">StyleSavvy</div>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to="/virtual-closet" className="nav-link">Virtual Closet</Link>
                </li>
                <li className="nav-item">
                    <Link to="/rate-outfit" className="nav-link">Rate My Outfit</Link>
                </li>
                <li className="nav-item">
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="nav-link">Logout</button>
                    ) : (
                        <Link to="/login" className="nav-link">Login</Link>
                    )}
                </li>
            </ul>
        </nav>
    );
}

export default Navbar