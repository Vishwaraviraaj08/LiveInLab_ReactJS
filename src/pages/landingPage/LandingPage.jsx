import React from 'react';
import './LandingPage.css';
import {Link} from "react-router-dom";

const LandingPage = () => {
    return (
        <div className="landing-container">
            <div className="landing-content">
                <div className="landing-square landing-twitch" style={{ marginBottom: '50px' }}>
                    <span className="landing-one"></span>
                    <span className="landing-two"></span>
                    <span className="landing-three"></span>
                    <div className="landing-circle">
                        <h2 className="landing-DrugRadar" style={{ fontFamily: "'Poppins', sans-serif" }}>Smart Steps</h2>
                        <br />
                        <p style={{ fontFamily: "'Poppins', sans-serif" }}>Unlock Your Dance Potential: Rhythm, Precision, Progress</p>
                    </div>
                </div>
                <br />
                <br />

                <Link to="/login" className="landing-button">
                    <span className="landing-actual-text">&nbsp;LOGIN/SIGNUP&nbsp;</span>
                    <span className="landing-hover-text" aria-hidden="true">&nbsp;LOGIN/SIGNUP&nbsp;</span>
                </Link>
            </div>
        </div>
    );
}

export default LandingPage;
