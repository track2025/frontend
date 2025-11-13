import React from 'react';

const Banner = () => {
    return (
        <div
            className="position-relative d-flex align-items-center justify-content-left text-white"
            style={{
                height: '400px',
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url("images/store-banner.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="text-center md:text-left  position-relative z-1 px-5 ">
                <h1 className="display-5 fw-bold mb-3">Precision. Protection. Performance.</h1>
                <p className="fs-5 mb-2">Built for racers, trusted worldwide.</p>
                <p className="fs-5 mb-2">But we still have Gain the competitive edge</p>
            </div>
        </div>
    );
};

export default Banner;
