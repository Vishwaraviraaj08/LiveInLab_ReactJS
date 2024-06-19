import React, {useState, useEffect} from 'react';
import './History.css'; // Assuming you have copied your styles into App.css

const App = () => {


    const data = [{
        title: 'Folk 1', date: '10/08/2023', time: '10:00 AM', match: '85%', errors: {
            head: '10%', shoulders: '5%', arms: '8%', torso: '7%', hips: '6%', legs: '9%', feet: '12%',
        },
    }, {
        title: 'Martial', date: '21/08/2023', time: '06:00 AM', match: '70%', errors: {
            head: '4%', shoulders: '7%', arms: '7%', torso: '9%', hips: '16%', legs: '4%', feet: '12%',
        },
    }, {
        title: 'Bharathanatiyam', date: '22/10/2023', time: '11:00 PM', match: '90%', errors: {
            head: '2%', shoulders: '5%', arms: '8%', torso: '7%', hips: '7%', legs: '9%', feet: '8%',
        },
    }, {
        title: 'Classical', date: '20/11/2023', time: '08:00 PM', match: '65%', errors: {
            head: '7%', shoulders: '5%', arms: '17%', torso: '27%', hips: '15%', legs: '9%', feet: '4%',
        },
    },];

    return (<div className="container-history">

            {data.map((item, index) => (
                <ul className="accordion">
                <li className="accordion__item">
                    <input type="checkbox" defaultChecked="true"/>
                    <i className="accordion__arrow"/>
                    <h2 className="accordion__title">{item.title}</h2>
                    <h2 className="accordion__title">{item.date + " " + item.time}</h2>
                    <p className="accordion__content" style={{display: 'flex', gap: '50px'}}>
                        <div className="accordion__content__left" style={{flex: '3'}}>
                            <h2>Overall Match : {item.match}</h2>
                            {
                                Object.keys(item.errors).map((key, index) => (
                                    <div>
                                        <h3>{key} : {item.errors[key]}</h3>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="accordion__content__right" style={{flex: '2'}}>
                            <img
                                src="https://www.researchgate.net/publication/336845588/figure/fig2/AS:818822411993088@1572233884086/Mean-performance-of-the-random-graph-generator-over-10-random-trials-Each-line.png"
                                width={"100%"} height={"auto"} alt={"sample"}/>
                        </div>
                    </p>
                </li>

            </ul>))}
        </div>


    );
};

export default App;
