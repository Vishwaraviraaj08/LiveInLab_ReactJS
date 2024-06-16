import React from 'react';
import './Signup.css';
import {Link} from "react-router-dom";

const Signup = () => {
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

                    <form className="loginpage-login-form">
                        <div className="loginpage-form-control">
                            <input type="text" placeholder="Username" />
                            <i className="fas fa-user"></i>
                        </div>
                        <div className="loginpage-form-control">
                            <input type="password" placeholder="Password" />
                            <i className="fas fa-lock"></i>
                        </div>
                        <div className="loginpage-form-control">
                            <input type="password" placeholder="Confirm Password" />
                            <i className="fas fa-lock"></i>
                        </div>

                        <button className="loginpage-submit">Sign Up</button>
                        <h4 style={{color:"white", textAlign:"center"}}>If already have an account, <Link to={'/login'}> Sign in !</Link></h4>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default Signup;
