import React from 'react';
import './Login.css';
import {Link} from "react-router-dom";

const Login = () => {
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

                    <form className="loginpage-login-form">
                        <div className="loginpage-form-control" >
                            <input type="text" placeholder="Username" />
                            <i className="fas fa-user"></i>
                        </div>
                        <div className="loginpage-form-control">
                            <input type="password" placeholder="Password" />
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
