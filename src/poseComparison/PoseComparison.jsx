import React, { useEffect, useRef, useState } from 'react';
import '../App.css';

function PoseComparison() {
    const videoRef = useRef(null);
    const liveVideoRef = useRef(null);
    const videoInputRef = useRef(null);
    const liveCanvasRef = useRef(null);
    const outputCoordsRef = useRef(null);

    const [videoPoses, setVideoPoses] = useState([]);
    const [livePoses, setLivePoses] = useState([]);
    const [similarities, setSimilarities] = useState([]);

    useEffect(() => {
        // Setup for uploaded video
        async function setupVideo(file) {
            const videoElement = videoRef.current;
            const url = URL.createObjectURL(file);
            videoElement.src = url;
            return new Promise((resolve) => {
                videoElement.onloadedmetadata = () => {
                    resolve(videoElement);
                };
            });
        }

        // Setup for live camera
        async function setupCamera() {
            const videoElement = liveVideoRef.current;
            const canvasElement = liveCanvasRef.current;
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoElement.srcObject = stream;

            return new Promise((resolve) => {
                videoElement.onloadedmetadata = () => {
                    resolve(videoElement);
                };
            });
        }

        async function extractPoses(videoElement, setPoses) {
            const pose = new window.Pose({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
            });

            pose.setOptions({
                modelComplexity: 1,
                enableSegmentation: true,
                smoothLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });

            pose.onResults((results) => {
                if (results.poseLandmarks) {
                    const poseCoordinates = results.poseLandmarks.map(landmark => ({
                        x: landmark.x,
                        y: landmark.y,
                        z: landmark.z
                    }));
                    setPoses(prevPoses => [...prevPoses, poseCoordinates]);
                }
            });

            videoElement.addEventListener('play', () => {
                const processVideoFrame = async () => {
                    if (videoElement.paused || videoElement.ended) {
                        return;
                    }
                    await pose.send({ image: videoElement });
                    requestAnimationFrame(processVideoFrame);
                };
                processVideoFrame();
            });
        }

        

        videoInputRef.current.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const videoElement = await setupVideo(file);
            extractPoses(videoElement, setVideoPoses);
        });

        setupCamera().then(liveVideoElement => {
            extractPoses(liveVideoElement, setLivePoses);
        });

    }, []);

    function calculateSimilarities(pose1, pose2) {
        function getDirectionsFromPose(pose) {
            const directions = [];
            for (const [i, j] of window.POSE_CONNECTIONS) {
                const diff = [pose[i].x - pose[j].x, pose[i].y - pose[j].y, pose[i].z - pose[j].z];
                const mag = Math.sqrt(diff[0]**2 + diff[1]**2 + diff[2]**2);
                directions.push(diff.map(d => d / mag));
            }
            return directions;
        }

        function compDirections(dirs1, dirs2) {
            return dirs1.map((dir, i) => dir.reduce((sum, d, j) => sum + d * dirs2[i][j], 0));
        }

        const dirs1 = getDirectionsFromPose(pose1);
        const dirs2 = getDirectionsFromPose(pose2);

        return compDirections(dirs1, dirs2);
    }

    useEffect(() => {
        if (videoPoses.length > 0 && livePoses.length > 0) {
            const latestVideoPose = videoPoses[videoPoses.length - 1];
            const latestLivePose = livePoses[livePoses.length - 1];
            const similarities = calculateSimilarities(latestVideoPose, latestLivePose);
            setSimilarities(similarities);
        }
    }, [videoPoses, livePoses]);

    return (
        <div className="App">
            <input type="file" ref={videoInputRef} accept="video/*" className="video-input" />
            <div style={{display:'flex', flexDirection:'row', gap:'20px'}}>
                <div className="video-container">
                    <video ref={videoRef} width="640" height="480" controls></video>
                </div>
                <div className="video-container">
                    <video ref={liveVideoRef} width="640" height="480" autoPlay muted></video>
                    <canvas ref={liveCanvasRef} width="640" height="480" style={{ display: 'none' }}></canvas>
                </div>
            </div>
            <pre ref={outputCoordsRef} id="output_coords">
                Similarities: {JSON.stringify(similarities, null, 2)}
            </pre>
        </div>
    );
}

export default PoseComparison;
