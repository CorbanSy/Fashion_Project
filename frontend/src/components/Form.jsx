import { useState } from "react";
import api, { registerUser } from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Form({ route, method, onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");  // Add password2 state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [showPassword2, setShowPassword2] = useState(false); // State to toggle confirm password visibility
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Create Account";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        setError("");
        if (method === "register" && password !== password2) {
            setLoading(false);
            setError("Passwords do not match");
            return;
        }
        try {
            if (method === "register") {
                await registerUser({ username, password, password2 });  // Include password2
                navigate("/login");
            } else if (method === "login") {
                const res = await api.post(route, { username, password });
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                onLogin(); // Notify the parent component of a successful login
                navigate("/");
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.response ? error.response.data.detail : error.message);
        } finally {
            setLoading(false);
        }
    };

    console.log('Rendering Form component with route:', route, 'and method:', method);

    return (
        <div className="form-wrapper">
            <form onSubmit={handleSubmit} className="form-container">
                <h1>{name}</h1>
                <input
                    className="form-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <div className="password-input-container">
                    <input
                        className="form-input"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        onClick={() => setShowPassword(!showPassword)}
                        className="password-toggle-icon"
                    />
                </div>
                {method === "register" && (
                    <div className="password-input-container">
                        <input
                            className="form-input"
                            type={showPassword2 ? "text" : "password"}
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            placeholder="Confirm Password"
                        />
                        <FontAwesomeIcon
                            icon={showPassword2 ? faEyeSlash : faEye}
                            onClick={() => setShowPassword2(!showPassword2)}
                            className="password-toggle-icon"
                        />
                    </div>
                )}
                {loading && <LoadingIndicator />}
                {error && <p className="error-message">{error}</p>}
                <button className="form-button" type="submit">
                    {name}
                </button>
            </form>
        </div>
    );
}

export default Form;
