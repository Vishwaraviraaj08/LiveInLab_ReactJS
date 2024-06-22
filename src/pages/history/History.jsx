import React, { useState, useEffect } from 'react';
import './History.css'; // Assuming you have copied your styles into App.css
import generateReport from './generateReport';

const History = ({ userId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fullscreenImage, setFullscreenImage] = useState(null);
    const [reportLoading, setReportLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    const limbNames = ["Right-Upper-Arm", "Right-Lower-Arm", "Shoulder", "Left-Upper-Arm", "Left-Lower-Arm", "Right-Lumbar", "Left-Lumbar", "Abdomen", "Right-Thigh", "Right-Cough", "Left-Thigh", "Left-Cough"];

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('https://smart-steps-api.netlify.app/user/' + userId + '/history', {
                    method: 'GET',
                });

                let data = await response.json();
                setData(data.history);
            } catch (error) {
                console.error('An error occurred while fetching the data', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [userId]);

    const handleImageClick = (src) => {
        setFullscreenImage(src);
    };

    const closeFullscreen = () => {
        setFullscreenImage(null);
    };

    const handleReportDownload = async (item) => {
        setReportLoading(true);
        setLoadingMessage('Please wait 12 seconds while we generate your report...');
        await generateReport(item);
        setReportLoading(false);
        setLoadingMessage('');
    };

    if (loading) {
        return <div className="loading-spinner"></div>;
    }

    return (
        <div className="container-history">
            {data && data.map((item, index) => (
                <ul className="accordion" key={index}>
                    <li className="accordion__item">
                        <input type="checkbox" defaultChecked="true" />
                        <i className="accordion__arrow" />
                        <h2 className="accordion__title">{item.label}</h2>
                        <h2 className="accordion__title accordion__date">{new Date(item.createdAt).toDateString()}</h2>
                        <p className="accordion__content" style={{ display: 'flex', gap: '50px' }}>
                            <div className="accordion__content__left" style={{ flex: '2' }}>
                                <h2>Overall Match: {item.overAllMatch}</h2>
                                {item.eachLimbMatch.reverse().map((val, index) => (
                                    <div key={index}>
                                        <h3>{limbNames[index]}: {val}</h3>
                                    </div>
                                ))}
                            </div>
                            <div className="accordion__content__right" style={{flex: '3'}}>
                                <img
                                    style={{backgroundColor: 'black', cursor: 'pointer'}}
                                    src={item.graphImage}
                                    width={"100%"} height={"auto"} alt={"sample"}
                                    onClick={() => handleImageClick(item.graphImage)}/>

                                <br/>
                                <br/>
                                <br/>

                                <button
                                    className={"download-btn"}
                                    onClick={() => handleReportDownload(item)}
                                    disabled={reportLoading}
                                >
                                    {reportLoading ? 'Generating Report...' : 'Download Report'}
                                </button>
                                <br/>
                                <br/>
                                {loadingMessage && (
                                    <div className="loading-message">
                                        {loadingMessage}
                                    </div>
                                )}
                            </div>
                        </p>
                    </li>
                </ul>
            ))}

            {fullscreenImage && (
                <div className="fullscreen-overlay" onClick={closeFullscreen}>
                    <div className="fullscreen-content" onClick={(e) => { e.stopPropagation(); closeFullscreen(); }}>
                        <img src={fullscreenImage} alt="Full Screen" />
                        <button className="close-button" onClick={closeFullscreen}>×</button>
                    </div>
                </div>
            )}


        </div>
    );
};

export default History;
