import React, { useEffect, useRef, useState } from 'react';
import RenderPose from './RenderPose.jsx';
import '../App.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


function PoseComparison() {
    const videoRef = useRef(null);
    const liveVideoRef = useRef(null);
    const videoInputRef = useRef(null);

    const [videoPose, setVideoPose] = useState(null);
    const [livePose, setLivePose] = useState(null);
    const [similarity, setSimilarity] = useState(null);
    const [matchPercentages, setMatchPercentages] = useState([]);
    const [videoDuration, setVideoDuration] = useState(0);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        // Setup for uploaded video
        async function setupVideo(file) {
            const videoElement = videoRef.current;
            const url = URL.createObjectURL(file);
            // flip video
            videoElement.style.transform = 'scaleX(-1)';
            videoElement.src = url;
            return new Promise((resolve) => {
                videoElement.onloadedmetadata = () => {
                    setVideoDuration(videoElement.duration);
                    resolve(videoElement);
                };
            });
        }

        // Setup for live camera
        async function setupCamera() {
            const videoElement = liveVideoRef.current;
            // flip camera
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

    }, []);

    useEffect(() => {
        if (videoPose != null && livePose != null) {
            const tempSimilarity = calculateSimilarities(videoPose, livePose);
            setSimilarity(tempSimilarity);

            const percentageMatchValue = percentageMatch(tempSimilarity);
            if (percentageMatchValue <= 70 && !videoRef.current.paused) {
                videoRef.current.pause();
            } else if (percentageMatchValue > 70 && videoRef.current.paused) {
                setMatchPercentages(prev => [...prev, { time: videoRef.current.currentTime, percentage: percentageMatchValue }]);
                videoRef.current.play();
            }
        }
        
    }, [videoPose, livePose]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.addEventListener('ended', generateReport);
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('ended', generateReport);
            }
        };
    }, [matchPercentages]);

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

    const data = [
        {
          name: 'Page A',
          uv: 4000,
          pv: 2400,
          amt: 2400,
        },
        {
          name: 'Page B',
          uv: 3000,
          pv: 1398,
          amt: 2210,
        },
        {
          name: 'Page C',
          uv: 2000,
          pv: 9800,
          amt: 2290,
        },
        {
          name: 'Page D',
          uv: 2780,
          pv: 3908,
          amt: 2000,
        },
        {
          name: 'Page E',
          uv: 1890,
          pv: 4800,
          amt: 2181,
        },
        {
          name: 'Page F',
          uv: 2390,
          pv: 3800,
          amt: 2500,
        },
        {
          name: 'Page G',
          uv: 3490,
          pv: 4300,
          amt: 2100,
        },
      ];

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
            <pre id="output_coords">
                {similarity != null && <p> Match : {percentageMatch(similarity).toFixed(2)}% </p>}
            </pre>
            
                
            <p style={{fontSize: '30px'}}>Match Percentage Over Time</p>
            <ResponsiveContainer>
                <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
                
            
        </div>
    );
}

export default PoseComparison;
