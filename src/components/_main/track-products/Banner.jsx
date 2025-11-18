import React from 'react';

const Banner = () => {
    return (
        <div
            className="position-relative d-flex align-items-center text-white"
            style={{
                height: '400px',
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url("images/store-banner.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="text-center text-md-start px-5">
                <h1 className="display-5 fw-bold mb-3">Track-Day Racing Gear & Motorsport Equipment</h1>
                <h2 className="fs-5 mb-2">Premium helmets, racewear, pit gear, and accessories for track-day drivers and racers.</h2>
            </div>
        </div>
    );
};

export default Banner;
