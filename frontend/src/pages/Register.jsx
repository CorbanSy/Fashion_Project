import Carousel from "../components/Carousel";
import Form from "../components/Form"
import "../styles/Register.css";

function Register() {
    return (
        <div className="page=container">
            <Carousel />
            <Form route="/api/user/register/" method="register" />
        </div>
    );
}

export default Register;