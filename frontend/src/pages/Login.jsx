import React from "react";
import ImageCarousel from "../components/Carousel";
import Form from "../components/Form";
import "../styles/Login.css";
import { Link } from "react-router-dom";

function Login({ onLogin }) {
    console.log("Rendering Login component")
    return (
        <div className="page-container">
            <div className="header">
                <h1 className="app-name">StyleSavvy</h1>
            </div>
            <div className="content-wrapper">
                <div className="carousel-wrapper">
                    <ImageCarousel />
                </div>
                <div className="center-wrapper">
                    <div className="form-wrapper">
                        <div className="form-container">
                            <h1>Login</h1>
                            <Form route="/token/" method="login" onLogin={onLogin}/>
                            <Link to="/register" className="create-account-link">
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="carousel-wrapper">
                    <ImageCarousel/>
                </div>
            </div>
        </div>
    );
}

export default Login;
