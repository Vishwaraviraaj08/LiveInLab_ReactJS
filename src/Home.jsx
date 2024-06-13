import {Link} from "react-router-dom";

import React from 'react'

function Home() {
    return (
        <>

            <style>
                {`
            body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #282c34;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.App {
  text-align: center;
}

.App-header {
  background-color: #333;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  max-width: 800px;
  width: 90%;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.button {
  padding: 15px 30px;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  background-color: #007bff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
}

.button:hover {
  background-color: #0056b3;
  box-shadow: 0 0 15px rgba(0, 91, 187, 0.5);
  transform: translateY(-2px);
}

.button:active {
  background-color: #004494;
  transform: translateY(0);
}

@media (max-width: 600px) {
  .button-container {
    flex-direction: column;
    gap: 10px;
  }

  .button {
    width: 100%;
  }
}

            `}
            </style>



            <h1>Welcome to Pose Detection</h1>
            <div className="button-container">
                <Link to="/live" className="button">To Fetch Data from Live Camera</Link>
                <Link to="/upload" className="button">To Fetch Data from Uploaded Video</Link>
            </div>
        </>
    )
}

export default Home
