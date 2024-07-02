import React from "react";
import ImageCarousel from "../components/Carousel";
import Form from "../components/Form";
import "../styles/Login.css"

function Login(){
    console.log("Rendering ")
    return <Form route="/api/token/" method="login" />
}
export default Login