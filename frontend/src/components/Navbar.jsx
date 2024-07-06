import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/Navbar.css";

function Navbar({ isLoggedIn, onLogout }) {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const handleLogout = () => {
        onLogout();
        navigate("/login");
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">StyleSavvy</div>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <div 
                        className="nav-link"
                        onMouseEnter={toggleDropdown}
                        onMouseLeave={toggleDropdown}
                    >
                        Virtual Closet
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <Link to="/virtual-closet?view=view-outfits" className="dropdown-item">View Outfits</Link>
                                <Link to="/virtual-closet?view=create-outfit" className="dropdown-item">Create Outfit</Link>
                                <Link to="/virtual-closet?view=generate-outfit" className="dropdown-item">Generate Outfit</Link>
                            </div>
                        )}
                    </div>
                </li>
                <li className="nav-item">
                    <Link to="/home" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                    <Link to="/rate-outfit" className="nav-link">Rate My Outfit</Link>
                </li>
                {isLoggedIn && (
                    <li className="nav-item">
                        <div
                            className='nav-link'
                            onMouseEnter={toggleProfileDropdown}
                            onMouseLeave={toggleProfileDropdown}
                        >
                            Profile
                            {profileDropdownOpen && (
                                <div className='dropdown-menu'>
                                    <Link to="/profile#profile-picutre" className='dropdown-item'>Profile Picture</Link>
                                    <Link to="/profile#bio" className='dropdown-item'>Bio</Link>
                                    <Link to="/profile#favorite-colors" className="dropdown-item">Favorite Colors</Link>
                                    <Link to="/profile#favorite-styles" className="dropdown-item">Favorite Styles</Link>
                                    <Link to="/profile#body-measurements" className="dropdown-item">Body Measurements</Link>
                                </div>
                            )}
                        </div>
                    </li>
                )}
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

export default Navbar;
