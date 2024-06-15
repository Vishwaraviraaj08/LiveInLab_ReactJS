import React, { useRef, useEffect } from 'react';

function RenderPose({ pose, colour }) {
    const canvasRef = useRef(null);


    useEffect(() => {
        console.log(colour);
        if (pose) {
            drawSkeleton(pose, canvasRef.current, colour);
        }
    }, [pose]);

    function drawSkeleton(pose, canvas, color) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        function drawPose(pose, color) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
            window.POSE_CONNECTIONS.forEach(([start, end]) => {
                const startPoint = pose[start];
                const endPoint = pose[end];
                ctx.beginPath();
                ctx.moveTo(startPoint.x * canvas.width, startPoint.y * canvas.height);
                ctx.lineTo(endPoint.x * canvas.width, endPoint.y * canvas.height);
                ctx.stroke();
            });

            pose.forEach((point) => {
                ctx.beginPath();
                ctx.arc(point.x * canvas.width, point.y * canvas.height, 5, 0, 2 * Math.PI);
                ctx.fillStyle = '#00FF00'; // Color for joints
                ctx.fill();
                ctx.stroke();
            });
        }

        drawPose(pose, color);
    }

    return (
        <div className="canvas-container">
            <canvas ref={canvasRef} width="640" height="480"></canvas>
        </div>
    );
}

export default RenderPose;
