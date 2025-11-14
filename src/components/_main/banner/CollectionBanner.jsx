import React from 'react';

const CollectionBanner = () => {
    return (
        <div
            className="position-relative d-flex align-items-center justify-content-center text-white"
            style={{
                height: '300px',
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url("images/collection-banner.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="text-center position-relative z-1">
                <h1 className="display-5 fw-bold mb-3">Gain the Competitive Edge</h1>
                {/* <p className="fs-5 mb-4">Superior kartwear and equipment designed to shave seconds off your lap times</p> */}
            </div>
        </div>
    );
};

export default CollectionBanner;
