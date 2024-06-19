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
import Testing from "./pages/testing/Testing.jsx";




function App() {
  const [count, setCount] = useState(0)

  return (
    <>


        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            {/*<Route path="/upload" element={<FromUploadedVideo />} />*/}
            {/*<Route path="/live" element={<FromLiveCamera />} />*/}
            <Route path="/comparison" element={<PoseComparison/>} />
            <Route path={"/history"} element={<History/>}/>
            <Route path={"/testing"} element={<Testing/>}/>
        </Routes>
    </>
  )
}

export default App
