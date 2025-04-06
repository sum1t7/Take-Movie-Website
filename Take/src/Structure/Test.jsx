import React from 'react';

const Test = () => {
    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <iframe
                src="https://vidjoy.pro/embed/movie/335983"
                title="Basic Iframe Player"
                width="800"
                height="450"
                style={{ border: 'none' }}
                allowFullScreen
            ></iframe>
        </div>
    );
};

export default Test;