import React, { useEffect, useRef } from 'react';
import '../App.css';

function FromUploadedVideo() {
    const videoRef = useRef(null);
    const outputCoordsRef = useRef(null);
    const videoInputRef = useRef(null);

    useEffect(() => {
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

        async function main() {
            videoInputRef.current.addEventListener('change', async (event) => {
                const file = event.target.files[0];
                if (!file) return;

                await setupVideo(file);

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

                videoRef.current.addEventListener('play', () => {
                    const processVideoFrame = async () => {
                        if (videoRef.current.paused || videoRef.current.ended) {
                            return;
                        }
                        await pose.send({ image: videoRef.current });
                        requestAnimationFrame(processVideoFrame);
                    };
                    processVideoFrame();
                });
            });
        }

        function onResults(results) {
            if (results.poseLandmarks) {
                const poseCoordinates = results.poseLandmarks.map(landmark => ({
                    x: landmark.x,
                    y: landmark.y,
                    z: landmark.z
                }));
                outputCoordsRef.current.innerHTML = JSON.stringify(poseCoordinates, null, 2);
            }
        }

        main();
    }, []);

    return (
        <div className="App">
            <input type="file" ref={videoInputRef} accept="video/*" className="video-input" />
            <div style={{display:'flex', flexDirection:'row', gap:'20px'}}>
                <div className="video-container">
                    <video ref={videoRef} width="640" height="480" controls></video>
                </div>
                <pre ref={outputCoordsRef} style={{maxHeight: '600px'}} id="output_coords"></pre>
            </div>
        </div>
    );
}

export default FromUploadedVideo;
