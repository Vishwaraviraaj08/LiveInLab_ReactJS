import React, { useRef, useEffect } from 'react';

function RenderPose({ pose, colour }) {
    const canvasRef = useRef(null);


    useEffect(() => {
        // console.log(colour);
        if (pose) {
            drawSkeleton(pose, canvasRef.current, colour);
        }
    }, [pose]);

    function drawSkeleton(pose, canvas, color) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // console.log(pose);

        function normalizePose(pose) {
            const hipMidpoint = {x: (pose[23].x + pose[24].x) / 2, y: (pose[23].y + pose[24].y) / 2};
            let points = pose.map(point => { return {x: point.x - hipMidpoint.x, y: point.y - hipMidpoint.y}});
            const maxPoint = points.reduce((max, point) => Math.sqrt(point.x * point.x + point.y * point.y) > Math.sqrt(max.x * max.x + max.y * max.y) ? point : max);
            let maxMag = Math.sqrt(maxPoint.x * maxPoint.x + maxPoint.y * maxPoint.y);
            points = points.map(point => { return { x: point.x / maxMag, y: point.y / maxMag}});
            points = points.map(point => { return { x: point.x * 0.5, y: point.y * 0.5}});
            points = points.map(point => { return { x: point.x + 0.5, y: point.y + 0.5}});
            return points;
        }

        function drawPose(pose, color) {
            let tempPose = normalizePose(pose);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
            window.POSE_CONNECTIONS.forEach(([start, end]) => {
                const startPoint = tempPose[start];
                const endPoint = tempPose[end];
                ctx.beginPath();
                ctx.moveTo(startPoint.x * canvas.width, startPoint.y * canvas.height);
                ctx.lineTo(endPoint.x * canvas.width, endPoint.y * canvas.height);
                ctx.stroke();
            });

            tempPose.forEach((point) => {
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
