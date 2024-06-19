import React from 'react';
import './Testing.css';


const FixedLayout = () => {
    return (
        <div className="layout-container">
            <div className="layout-top">
                <div className="layout-top-left">Top Left Content</div>
                <div className="layout-top-right">
                    <div className="layout-top-right-upper">Top Right Upper Content</div>
                    <div className="layout-top-right-lower">Top Right Lower Content</div>
                </div>
            </div>
            <div className="layout-bottom">
                <div className="layout-bottom-left">Bottom Left Content</div>
                <div className="layout-bottom-center">Bottom Center Content</div>
                <div className="layout-bottom-right">Bottom Right Content</div>
            </div>
        </div>
    );
};

export default FixedLayout;
