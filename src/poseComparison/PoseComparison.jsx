import React, {useEffect, useRef, useState} from 'react';
import RenderPose from './RenderPose.jsx';
import RenderChart from './RenderChart.jsx';
import './PoseComparison.css';



function PoseComparison() {

    const videoRef = useRef(null);
    const liveVideoRef = useRef(null);
    const videoInputRef = useRef(null);
    const [uploaded, isUploaded] = useState(false);


    const [videoPose, setVideoPose] = useState(null);
    const [livePose, setLivePose] = useState(null);
    const [similarity, setSimilarity] = useState(null);
    const [matchPercentages, setMatchPercentages] = useState([]);
    const [videoDuration, setVideoDuration] = useState(0);
    const [videoEnded, setVideoEnded] = useState(false);
    const limbNames = ["Right-Upper-Arm", "Right-Lower-Arm" , "Shoulder" , "Left-Upper-Arm" , "Left-Lower-Arm" , "Right-Lumbar" , "Left-Lumbar" , "Abdomen" , "Right-Thigh" , "Right-Cough" , "Left-Thigh" , "Left-Cough"]


    useEffect(() => {
        async function setupVideo(file) {
            const videoElement = videoRef.current;
            const url = URL.createObjectURL(file);
            videoElement.style.transform = 'scaleX(-1)';
            videoElement.src = url;
            window.scrollTo(0, document.body.scrollHeight);

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
            const stream = await navigator.mediaDevices.getUserMedia({video: true});
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
                        x: landmark.x, y: landmark.y, z: landmark.z
                    }));
                    setPoses(poseCoordinates);
                }
            });

            videoElement.addEventListener('play', () => {
                const processVideoFrame = async () => {
                    if (videoElement.paused || videoElement.ended) {
                        return;
                    }
                    await pose.send({image: videoElement});
                    requestAnimationFrame(processVideoFrame);
                };
                processVideoFrame();
            });
        }

        videoInputRef.current.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const videoElement = await setupVideo(file);
            await extractPoses(videoElement, setVideoPose);
        });

        setupCamera().then(liveVideoElement => {
            extractPoses(liveVideoElement, setLivePose);
        });

        videoRef.current.addEventListener('ended', () => {
            // console.log("Video Ended");
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
            if (percentageMatchValue > 70 && !videoEnded) {

                setMatchPercentages(prev => {
                    if (prev.length === 0) {
                        return [{time: videoRef.current.currentTime, percentage: percentageMatchValue}];
                    } else {
                        if (prev[prev.length - 1].time < videoRef.current.currentTime) {
                            return [...prev, {time: videoRef.current.currentTime, percentage: percentageMatchValue}];
                        } else {
                            return prev;
                        }
                    }
                });

                if (videoRef.current.paused) {
                    videoRef.current.play();
                }
            }
            if (videoEnded) {
                videoRef.current.pause();
            }
        }

    }, [videoPose, livePose]);

    function calculateSimilarities(pose1, pose2) {
        function getDirectionsFromPose(pose) {
            const directions = [];
            for (const [i, j] of window.POSE_CONNECTIONS) {
                const diff = [pose[i].x - pose[j].x, pose[i].y - pose[j].y, pose[i].z - pose[j].z];
                const mag = Math.sqrt(diff[0] ** 2 + diff[1] ** 2 + diff[2] ** 2);
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
        const limbNames = ["Right-Upper-Arm", "Right-Lower-Arm" , "Shoulder" , "Left-Upper-Arm" , "Left-Lower-Arm" , "Right-Lumbar" , "Left-Lumbar" , "Abdomen" , "Right-Thigh" , "Right-Cough" , "Left-Thigh" , "Left-Cough"]

        for (let i of limbIndexes) {
            eachPercentageMatch.push((similarities[i] * 100).toFixed(2));
        }
        return eachPercentageMatch;
    }

    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState(null);

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        const uploadedFile = e.dataTransfer.files[0];
        setFile(uploadedFile);
        isUploaded(true);
    //     scroll down 100%

    };







    return (<div>

        <div className={"upload-container"}>
            <div
                className={`file-upload-container ${dragging ? 'dragging' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="file-upload-input"
                    className="file-upload-input"
                    ref={videoInputRef}
                    accept="video/*"
                    width={"50px"}
                />

                <label htmlFor="file-upload-input" className="file-upload-label">
                    {file ? file.name : 'Drag and drop a file or click to upload'}
                </label>
            </div>
        </div>

        <div className={"comparison-main"}>
            <div className="layout-container">
                <div className="layout-left">
                    <div className="layout-left-top">
                        <div className="layout-left-top-1">
                            <video ref={videoRef} width="100%" height="100%" controls muted></video>
                        </div>
                        <div className="layout-left-top-2">
                            Errors in each Limb:<br/>
                            {similarity != null &&
                                <p style={{display: 'flex', flexDirection: 'column'}}>
                                    <table border={1} width={"250px"}>
                                        <tbody>
                                        {eachPercentageMatch(similarity).map((value, index) => (
                                            <tr key={index}>
                                                <td>{limbNames[index]}</td>
                                                <td>{value}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </p>}
                        </div>
                    </div>
                    <div className="layout-left-bottom">
                        <div className="layout-left-bottom-1" style={{paddingLeft: '80px'}}>
                            <video ref={liveVideoRef} width="auto" height={"100%"} autoPlay muted></video>
                    </div>
                    <div className="layout-left-bottom-2">
                        overall Match : {similarity != null && <h1> {percentageMatch(similarity).toFixed(2)}% </h1>}
                    </div>
                </div>
            </div>
            <div className="layout-right">
                <div className="layout-right-top">
                    <RenderPose pose={videoPose} colour={"red"} flip={true}/>
                </div>
                <div className="layout-right-bottom">
                    <RenderPose pose={livePose} colour={"blue"} flip={true}/>
                </div>
            </div>
        </div>
    </div>



        {/*{videoEnded && <RenderChart matchPercentages={matchPercentages} videoDuration={videoDuration}/>}*/}

    </div>);
}



export default PoseComparison;
