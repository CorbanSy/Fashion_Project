import { useState } from "react";
import api, { registerUser } from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method, onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");  // Add password2 state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Create Account";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        setError("");
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
                <input
                    className="form-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                {method === "register" && (
                    <input
                        className="form-input"
                        type="password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        placeholder="Confirm Password"
                    />
                )}
                {loading && <LoadingIndicator />}
                <button className="form-button" type="submit">
                    {name}
                </button>
            </form>
        </div>
    );
}

export default Form;
