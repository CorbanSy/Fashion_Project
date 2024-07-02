import React from "react";
import ImageCarousel from "../components/Carousel";
import Form from "../components/Form"
import "../styles/Register.css";

function Register() {
    console.log("Rendering Register componet")
    return (
        <div className="page-container">
            <div className="carousel-wrapper">
                <ImageCarousel />
            </div>
            <div className="center-wrapper">
                <h1 className="center-wrapper">StyleSavvy</h1>
                <div className="form-wrapper">
                    <Form route="/api/user/register/" method="register" />
                </div>
            </div>
            <div className="carousel-wrapper">
                <ImageCarousel />
            </div>
        </div>
    );
}

export default Register;