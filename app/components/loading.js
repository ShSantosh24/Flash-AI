import React from 'react';

import './loading.css';

const LoadingAnimation2 = () => {
    return (
        <div className="loading-overlay">
            <div className="loading-content">
                <h1 className="loading-logo"> Flash-AI</h1>
                <div className="loading-spinner"></div>
                <p className="loading-text">Generating Your Study Set...</p>
            </div>
        </div>
    );
};

export default LoadingAnimation2