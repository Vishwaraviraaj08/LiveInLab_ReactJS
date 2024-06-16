import React, { useEffect, useRef, useState } from 'react';
import RenderPose from './RenderPose.jsx';
import RenderChart from './RenderChart.jsx';



function PoseComparison() {
    const videoRef = useRef(null);
    const liveVideoRef = useRef(null);
    const videoInputRef = useRef(null);

    const [videoPose, setVideoPose] = useState(null);
    const [livePose, setLivePose] = useState(null);
    const [similarity, setSimilarity] = useState(null);
    const [matchPercentages, setMatchPercentages] = useState([]);
    const [videoDuration, setVideoDuration] = useState(0);
    const [videoEnded, setVideoEnded] = useState(false);

    useEffect(() => {
        async function setupVideo(file) {
            const videoElement = videoRef.current;
            const url = URL.createObjectURL(file);
            videoElement.style.transform = 'scaleX(-1)';
            videoElement.src = url;
            return new Promise((resolve) => {
                videoElement.onloadedmetadata = () => {
                    setVideoDuration(videoElement.duration);
                    resolve(videoElement);
                };
            });
        }

        async function setupCamera() {
            const videoElement = liveVideoRef.current;
            videoElement.style.transform = 'scaleX(-1)';
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
                    setPoses(poseCoordinates);
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
            extractPoses(videoElement, setVideoPose);
        });

        setupCamera().then(liveVideoElement => {
            extractPoses(liveVideoElement, setLivePose);
        });

        videoRef.current.addEventListener('ended', () => {
            setVideoEnded(true);
        });

    }, []);

    useEffect(() => {
        if (videoPose != null && livePose != null) {
            const tempSimilarity = calculateSimilarities(videoPose, livePose);
            setSimilarity(tempSimilarity);

            const percentageMatchValue = percentageMatch(tempSimilarity);
            if (percentageMatchValue <= 70 && !videoRef.current.paused) {
                videoRef.current.pause();
            }
            if (percentageMatchValue > 70) {
                setMatchPercentages(prev => [...prev, { time: videoRef.current.currentTime, percentage: percentageMatchValue }]);
            }
            if(videoRef.current.paused && percentageMatchValue > 70 && !videoEnded){
                videoRef.current.play();
            }
        }
        
    }, [videoPose, livePose]);

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

    function percentageMatch(similarities) {
        return (similarities.reduce((sum, similarity) => sum + similarity, 0) / similarities.length) * 100;
    }

    function eachPercentageMatch(similarities, totalPercentageMatch) {
        const limbIndexes = [9, 10, 11, 16, 17, 22, 23, 24, 25, 27, 26, 28];
        let eachPercentageMatch = [];

    
        for(let i of limbIndexes){
            eachPercentageMatch.push((similarities[i] * 100).toFixed(2));
        }
        return eachPercentageMatch;
    }

    function generateReport() {
        console.log("Report Generated");
    }

    

    return (
        <div className="App">
            <input type="file" ref={videoInputRef} accept="video/*" className="video-input" />
            <div style={{display:'flex', flexDirection:'row', gap:'20px'}}>
                <div className="video-container">
                    <video ref={videoRef} width="640" height="480" controls muted></video>
                </div>
                <div className="video-container">
                    <video ref={liveVideoRef} width="640" height="480" autoPlay muted></video>
                </div>
            </div>
            <div style={{display:'flex', flexDirection:'row', gap:'20px'}}>
                <RenderPose pose={videoPose} colour={"red"} flip={true}/>
                <RenderPose pose={livePose} colour={"blue"} flip={true}/>
            </div>
            
            
                
            <p style={{fontSize: '30px'}}>Match Percentage Over Time</p>
            <pre id="output_coords">
                {similarity != null && <p> Match : {percentageMatch(similarity).toFixed(2)}% </p>}
            </pre>
            {videoEnded && <RenderChart matchPercentages={matchPercentages} />}
            
        </div>
    );
}

export default PoseComparison;
