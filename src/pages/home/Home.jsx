import React, { useEffect, useState } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';



const Home = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const navbar = document.getElementById("home-navbar");
        const sticky = navbar.offsetTop;

        const stickNavbar = () => {
            if (window.pageYOffset > sticky) {
                navbar.classList.add("sticky");
            } else {
                navbar.classList.remove("sticky");
            }
        };

        window.onscroll = function() { stickNavbar(); };

        return () => {
            window.onscroll = null;
        };
    }, []);

    return (
        <div>
            <div className="home-navbar" id="home-navbar">
                <div className="home-logo">
                    <a href="#" style={{ fontSize: "20px" }}>Smart Steps</a>
                </div>
                <div className="home-nav-links" >
                    <Link to={"/history"} style={{ fontSize: "20px" }}>History</Link>
                    <a href="https://github.com/Vishwaraviraaj08/LiveInLab_ReactJS">Github</a>
                </div>
            </div>
            <div className="home-container">
                <h1 className={"home-h1"}>Smart Steps</h1>
                <p className={"home-p"}>Enhance The Dance Through AI Driven Analysis</p>
                <br/>
                <br/>
                <Link to="/comparison" className="home-cta-button">Try Out</Link>
            </div>
            <div className="home-container-bottom">
                <h1 className={"home-h1"}>About</h1>
                <div className="home-features">
                    <div className="home-feature-item">
                        <h2>Abstract</h2>
                        <p className={"home-p"}
                           style={{fontSize: '20px', textAlign: 'justify', margin: '60px', lineHeight: '35px'}}>The
                            field of dance training and evaluation is vital for dancers to enhance their skills and
                            artistic expression. However, current evaluation methods often rely on subjective
                            assessments, leading to inconsistent and biased evaluations, thereby hindering dancers'
                            ability to assess progress and identify areas for improvement. Furthermore, the lack of
                            objective evaluation methods poses challenges in setting realistic goals and monitoring
                            progress over time. In response to these challenges, this paper proposes an automated system
                            designed to provide accurate and objective evaluations of dancers' performances.
                            Our proposed system utilizes advanced techniques in computer vision and pose extraction to
                            analyse videos of both a dance trainer and a dancer attempting to replicate the trainer's
                            moves. Key body landmarks are extracted from both videos to represent poses, enabling a
                            detailed comparison between them. The system employs a method of comparing poses by
                            analysing the direction of each limb and computing a percentage match between the poses. The
                            results provide dancers with quantitative feedback on their performance, allowing them to
                            accurately track progress and identify areas for improvement. By providing objective
                            evaluations, our system ensures fair assessments across different dancers, fostering
                            continuous improvement in their skills and artistic expression.
                        </p>
                    </div>
                    <div className="home-feature-item">
                        <h2>Techies Used</h2>
                        <div style={{textAlign: 'left', margin: '60px'}}>
                            <h2>MediaPipe Pose</h2>
                            <p className={"home-p"}
                               style={{fontSize: '20px', textAlign: 'justify', margin: '60px', lineHeight: '10px'}}>Used
                                for pose estimation, providing precise body position data.</p>

                            <h2>OpenCV</h2>
                            <p className={"home-p"} style={{
                                fontSize: '20px',
                                textAlign: 'justify',
                                margin: '60px',
                                lineHeight: '10px'
                            }}>Handles video data for processing, including capturing, reading, and preprocessing
                                frames.</p>
                            <h2>Pose Comparison</h2>
                            <p className={"home-p"} style={{
                                fontSize: '20px',
                                textAlign: 'justify',
                                margin: '60px',
                                lineHeight: '10px'
                            }}>Utilizes limb directional vectors and cosine similarity to objectively compare poses.</p>
                        </div>
                    </div>
                </div>

                <h1>Project developed by.....</h1>
                <div className="contact-section" style={{display: 'flex', gap: '40px'}}>

                <div className="card-box1 card">
                        <div className="card-content">
                            <div className="card-image">
                                <img src="https://cdn-icons-png.flaticon.com/512/2784/2784488.png" alt="Profile Image"/>
                            </div>
                            <div className="card-text">
                                <p className="card-name">Dr. Suresh Kumar M</p>
                                <p className="card-job_title">Prof. @ Networking</p>

                            </div>
                            <div className="card-button">
                                <div>
                                    <a href={"mailto:sureshkumar.it@sairam.edu.in"}>
                                        <button className="card-message" type="button">Mail</button>
                                    </a>
                                </div>
                                <div>
                                    <a href={"tel:+91 9940371151"}>
                                        <button className="card-connect" type="button">Contact</button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="card-box1 card">
                        <div className="card-content">
                            <div className="card-image">
                                <img src="https://i.pinimg.com/736x/b1/88/c6/b188c6801ad1d71d3c962c6e4aa2d0cf.jpg" alt="Profile Image"/>
                            </div>

                            <div className="card-text">
                                <p className="card-name">Sukhresswarun R</p>
                                <p className="card-job_title">Full Stack Dev</p>

                            </div>

                            <div className="card-button">
                                <div>
                                    <a href={"mailto:sec21it016@sairamtap.edu.in"}>
                                        <button className="card-message" type="button">Mail</button>
                                    </a>
                                </div>
                                <div>
                                    <a href={"tel:+91 9789858295"}>
                                        <button className="card-connect" type="button">Contact</button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="card-box1 card">
                        <div className="card-content">
                            <div className="card-image">
                                <img src="https://th.bing.com/th/id/OIP.5mOC-ugYRmi8qzjtjUl5zQAAAA?rs=1&pid=ImgDetMain" alt="Profile Image"/>
                            </div>
                            <div className="card-text">
                                <p className="card-name">Vishwa Raviraaj S I</p>
                                <p className="card-job_title">Full Stack Dev</p>

                            </div>

                            <div className="card-button">
                                <div>
                                    <a href={"mailto:sec21it072@sairamtap.edu.in"}>
                                        <button className="card-message" type="button">Mail</button>
                                    </a>
                                </div>
                                <div>
                                    <a href={"tel:+91 9444266312"}>
                                        <button className="card-connect" type="button">Contact</button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>





                </div>
            </div>
        </div>
    );
}

export default Home;
