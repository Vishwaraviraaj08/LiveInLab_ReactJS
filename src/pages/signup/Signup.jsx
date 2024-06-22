import React, { useRef, useState } from 'react';
import './Signup.css';
import { Link, useNavigate } from "react-router-dom";

const Signup = ({ setUserId }) => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const sign = useRef(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (sign.current) {
            return;
        } else {
            sign.current = true;
            setLoading(true);
        }

        try {
            const response = await fetch('https://smart-steps-api.netlify.app/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: username, email, password }),
            });

            const data = await response.json();

            if (data.created) {
                setUserId(data.id);
                navigate('/login');
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
            sign.current = false;
        }
    };

    return (
        <div className="loginpage-container">
            <section className="loginpage-side">
                <img src="/images/login-img.svg" alt="Illustration" />
            </section>

            <section className="loginpage-main">
                <div className="loginpage-login-container">
                    <p className="loginpage-title">Welcome User</p>
                    <div className="loginpage-separator"></div>
                    <p className="loginpage-welcome-message">Please, provide your credentials to proceed and have access to all our services</p>

                    <form className="loginpage-login-form" onSubmit={handleSignup}>
                        <div className="loginpage-form-control">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                            />
                            <i className="fas fa-user"></i>
                        </div>
                        <div className="loginpage-form-control">
                            <input
                                type="text"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                            <i className="fas fa-lock"></i>
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
                            {loading ? 'Loading...' : 'Sign Up'}
                        </button>
                        <h4 style={{ color: "white", textAlign: "center" }}>
                            If already have an account, <Link to={'/login'} style={{ color: '#8b33c5' }}> Sign in !</Link>
                        </h4>
                    </form>
                    {loading && <div className="loading-spinner"></div>}
                </div>
            </section>
        </div>
    );
}

export default Signup;
