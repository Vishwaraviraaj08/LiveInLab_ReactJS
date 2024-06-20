import { useState } from 'react'
import {Link, Route, Routes} from 'react-router-dom'
import './App.css'
import FromLiveCamera from "./fromLiveCamera/FromLiveCamera.jsx";
import FromUploadedVideo from "./fromUploadedVideo/FromUploadedVideo.jsx";
import PoseComparison from "./poseComparison/PoseComparison.jsx";
import LandingPage from "./pages/landingPage/LandingPage.jsx";
import Login from './pages/login/Login.jsx'
import Signup from "./pages/signup/Signup.jsx";
import History from "./pages/history/History.jsx"
import Home from "./pages/home/Home.jsx";
import { useEffect } from 'react';


const MobileWarning = () => {
    return (
        <>
            <style>
                {
                    `
                    /* MobileWarning.css */
.mobile-warning {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 1);
  color: white;
  font-size: 1.5em;
  text-align: center;
  z-index: 1000;
}

                    `
                }
            </style>
        <div className="mobile-warning">
            <p>Sorry, this website is not optimized for mobile devices. Please use a desktop or laptop to access the website.</p>
        </div>
        </>
    )

}
function App() {
  const [userId, setUserId] = useState(null);
  const useDeviceType = () => {
      const [isMobile, setIsMobile] = useState(false);

        useEffect(() => {
            const checkDevice = () => {
                setIsMobile(window.innerWidth <= 768);
            };

            checkDevice();

            window.addEventListener('resize', checkDevice);
            return () => {
                window.removeEventListener('resize', checkDevice);
            };
        }, []);

        return isMobile;
    };

    const isMobile = useDeviceType();
  return (
    <>
        <div>
            {
                isMobile ? <MobileWarning/> :



        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login setUserId={setUserId}/>}/>
            <Route path="/signup" element={<Signup setUserId={setUserId}/>}/>
            {/*<Route path="/upload" element={<FromUploadedVideo />} />*/}
            {/*<Route path="/live" element={<FromLiveCamera />} />*/}
            <Route path="/comparison" element={<PoseComparison userId={userId}/>} />
            <Route path={"/history"} element={<History userId={userId}/>}/>
            <Route path={"/home"} element={<Home/>} />
        </Routes>
            }
        </div>
    </>
  )
}

export default App
