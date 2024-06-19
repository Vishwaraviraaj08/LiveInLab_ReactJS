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



function App() {
  const [userId, setUserId] = useState(null);


  return (
    <>


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
    </>
  )
}

export default App
