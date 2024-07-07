import React from "react";
import ImageCarousel from "../components/Carousel";
import Form from "../components/Form";
import "../styles/Register.css";
import { Link } from "react-router-dom";

function Register() {
    console.log("Rendering Register component");
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
                            <h1>Create Account</h1>
                            <Form route="/api/user/register/" method="register" />
                            <Link to="/login" className="create-account-link">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="carousel-wrapper">
                    <ImageCarousel />
                </div>
            </div>
        </div>
    );
}

export default Register;
