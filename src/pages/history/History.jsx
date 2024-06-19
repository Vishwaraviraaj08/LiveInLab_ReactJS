import React, {useState, useEffect} from 'react';
import './History.css'; // Assuming you have copied your styles into App.css

const History = ({userId}) => {
    const [data, setData] = useState(null);

    const limbNames = ["Right-Upper-Arm", "Right-Lower-Arm" , "Shoulder" , "Left-Upper-Arm" , "Left-Lower-Arm" , "Right-Lumbar" , "Left-Lumbar" , "Abdomen" , "Right-Thigh" , "Right-Cough" , "Left-Thigh" , "Left-Cough"]

    useEffect(() => {
        async function fetchData() {

            const response = await fetch('https://smart-steps-api.netlify.app/user/'+userId+'/history', {
                method: 'GET',
            });

            let data = await response.json();
            setData(data.history);
        }
        fetchData().then();
    }, []);

    return (<div className="container-history">
            {data && data.map((item, index) => (
                <ul className="accordion">
                <li className="accordion__item">
                    <input type="checkbox" defaultChecked="true"/>
                    <i className="accordion__arrow"/>
                    <h2 className="accordion__title">{item.label}</h2>
                    <h2 className="accordion__title">{new Date(item.createdAt).toDateString()}</h2>
                    <p className="accordion__content" style={{display: 'flex', gap: '50px'}}>
                        <div className="accordion__content__left" style={{flex: '3'}}>
                            <h2>Overall Match : {item.overAllMatch}</h2>
                            {
                                item.eachLimbMatch.map((val, index) => (
                                    <div key={index}>
                                        <h3>{limbNames[index]} : {val}</h3>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="accordion__content__right" style={{flex: '2'}}>
                            <img
                                src={`data:image/png;base64,${item.graphImage}`}
                                width={"100%"} height={"auto"} alt={"sample"}/>
                        </div>
                    </p>
                </li>

            </ul>))}
        </div>


    );
};

export default History;
