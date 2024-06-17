import React, { useEffect, useRef } from 'react';
import '../App.css';

function FromLiveCamera() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const outputCoordsRef = useRef(null);

    useEffect(() => {
        async function setupCamera() {
            const videoElement = videoRef.current;
            const canvasElement = canvasRef.current;
            const canvasCtx = canvasElement.getContext('2d');

            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            videoElement.srcObject = stream;

            return new Promise((resolve) => {
                videoElement.onloadedmetadata = () => {
                    resolve(videoElement);
                };
            });
        }

        async function main() {
            await setupCamera();

            const pose = new window.Pose({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
                },
            });

            pose.setOptions({
                modelComplexity: 1,
                enableSegmentation: true,
                smoothLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });

            pose.onResults(onResults);

            const camera = new window.Camera(videoRef.current, {
                onFrame: async () => {
                    await pose.send({ image: videoRef.current });
                },
                width: 640,
                height: 480,
            });
            camera.start();
        }

        function onResults(results) {
            const canvasElement = canvasRef.current;
            const canvasCtx = canvasElement.getContext('2d');

            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

            if (results.poseLandmarks) {
                window.drawConnectors(canvasCtx, results.poseLandmarks, window.POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
                window.drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#FF0000', lineWidth: 2 });

                const poseCoordinates = results.poseLandmarks.map(landmark => ({
                    x: landmark.x,
                    y: landmark.y,
                    z: landmark.z
                }));
                outputCoordsRef.current.innerHTML = JSON.stringify(poseCoordinates, null, 2);
            }
            canvasCtx.restore();
        }

        main();
    }, []);

    return (
        <div>
            <div className="video-container">
                <video ref={videoRef} width="640" height="480" autoPlay muted></video>
                <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }}></canvas>
            </div>
            <pre ref={outputCoordsRef} id="output_coords"></pre>
        </div>
    );
}

export default FromLiveCamera;
