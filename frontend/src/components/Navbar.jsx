import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/Navbar.css";
import searchIcon from 'C:/Users/corba/Fashion_Project/backend/media/search-icon.png'; // Import the image

function Navbar({ isLoggedIn, onLogout }) {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [fashionTipsDropdownOpen, setFashionTipsDropdownOpen] = useState(false);
    const [rateMyOutfitDropdownOpen, setRateMyOutfitDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        onLogout();
        navigate("/login");
    };

    const toggleDropdown = (isOpen) => {
        setDropdownOpen(isOpen);
    };

    const toggleProfileDropdown = (isOpen) => {
        setProfileDropdownOpen(isOpen);
    };

    const toggleFashionTipsDropdown = (isOpen) => {
        setFashionTipsDropdownOpen(isOpen);
    };

    const toggleRateMyOutfitDropdown = (isOpen) => {
        setRateMyOutfitDropdownOpen(isOpen);
    };

    const handleSearch = (event) => {
        if (event.key === 'Enter') {
            navigate(`/search?query=${searchQuery}`);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">StyleSavvy</div>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to="/home" className="nav-link">Home</Link>
                </li>
                <li
                    className="nav-item"
                    onMouseEnter={() => toggleDropdown(true)}
                    onMouseLeave={() => toggleDropdown(false)}
                >
                    <div className="nav-link">
                        Virtual Closet
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <Link to="/view-outfits" className="dropdown-item">View Outfits</Link> {/* Updated Link */}
                                <Link to="/virtual-closet?view=create-outfit" className="dropdown-item">Create Outfit</Link>
                                <Link to="/virtual-closet?view=generate-outfit" className="dropdown-item">Generate Outfit</Link>
                            </div>
                        )}
                    </div>
                </li>
                <li
                    className="nav-item"
                    onMouseEnter={() => toggleRateMyOutfitDropdown(true)}
                    onMouseLeave={() => toggleRateMyOutfitDropdown(false)}
                >
                    <div className="nav-link">
                        Rate My Outfit
                        {rateMyOutfitDropdownOpen && (
                            <div className="dropdown-menu">
                                <Link to="/rate-outfit#upload-outfit" className="dropdown-item">Upload Outfit</Link>
                                <Link to="/rate-outfit#upload-clothing-item" className="dropdown-item">Upload Clothing Item</Link>
                            </div>
                        )}
                    </div>
                </li>
                <li
                    className="nav-item"
                    onMouseEnter={() => toggleFashionTipsDropdown(true)}
                    onMouseLeave={() => toggleFashionTipsDropdown(false)}
                >
                    <div className="nav-link">
                        Fashion Tips
                        {fashionTipsDropdownOpen && (
                            <div className="dropdown-menu">
                                <Link to="/fashion-tips?category=Seasonal Tips" className="dropdown-item">Seasonal Tips</Link>
                                <Link to="/fashion-tips?category=Occasion Wear" className="dropdown-item">Occasion Wear</Link>
                                <Link to="/fashion-tips?category=Accessorizing" className="dropdown-item">Accessorizing</Link>
                                <Link to="/fashion-tips?category=Wardrobe Essentials" className="dropdown-item">Wardrobe Essentials</Link>
                                <Link to="/fashion-tips?category=Body Type Tips" className="dropdown-item">Body Type Tips</Link>
                                <Link to="/fashion-tips?category=Color Theory" className="dropdown-item">Color Theory</Link>
                            </div>
                        )}
                    </div>
                </li>
                {isLoggedIn && (
                    <li
                        className="nav-item"
                        onMouseEnter={() => toggleProfileDropdown(true)}
                        onMouseLeave={() => toggleProfileDropdown(false)}
                    >
                        <div className="nav-link">
                            Profile
                            {profileDropdownOpen && (
                                <div className="dropdown-menu">
                                    <Link to="/profile#profile-picture" className="dropdown-item">Profile Picture</Link>
                                    <Link to="/profile#bio" className="dropdown-item">Bio</Link>
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
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="Search" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearch}
                />
                <button className="search-button">
                    <img src={searchIcon} alt="search" />
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
