import { useState } from 'react'
import {Link, Route, Routes} from 'react-router-dom'
import './App.css'
import FromLiveCamera from "./fromLiveCamera/FromLiveCamera.jsx";
import FromUploadedVideo from "./fromUploadedVideo/FromUploadedVideo.jsx";
import PoseComparison from "./poseComparison/PoseComparison.jsx";
import Home from "./Home.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<FromUploadedVideo />} />
            <Route path="/live" element={<FromLiveCamera />} />
            <Route path="/comparison" element={<PoseComparison />} />
        </Routes>
    </>
  )
}

export default App
