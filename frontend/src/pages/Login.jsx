import React from "react";
import ImageCarousel from "../components/Carousel";
import Form from "../components/Form";
import "../styles/Login.css"

function Login(){
    console.log("Rendering Login component")
    return (
        <div className="page-container">
            <div className="carousel-wrapper">
                <ImageCarousel />
            </div>
            <div className="center-wrapper">
                <h1 className="app-name">StyleSavvy</h1>
                <div className="form-wrapper">
                    <Form route="/api/token/" method="login"/>
                </div>
            </div>
            <div className="carousel-wrapper">
                <ImageCarousel/>
            </div>
        </div>
    );
}
export default Login;