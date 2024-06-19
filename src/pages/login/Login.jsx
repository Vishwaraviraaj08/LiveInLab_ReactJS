import React, {useState} from 'react';
import './Login.css';
import {Link, useNavigate} from "react-router-dom";

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://smart-steps-api.netlify.app/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.created) {
                navigate('/comparison');
            } else {
                alert("Invalid credentials. Please try again.");
            }
        } catch (error) {
            // Handle network or other errors
            alert('An error occurred. Please try again later.');
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
                        <div className="loginpage-form-control" >
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <i className="fas fa-user"></i>
                        </div>
                        <div className="loginpage-form-control">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <i className="fas fa-lock"></i>
                        </div>

                        <button className="loginpage-submit">Login</button>
                        <h4 style={{color:"white", textAlign:"center"}}>If new user, <Link to={'/signup'} style={{color: '#8b33c5'}}> Sign Up !</Link></h4>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default Login;
