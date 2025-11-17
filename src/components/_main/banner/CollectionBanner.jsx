import React from 'react';
import BreadcrumbLink from 'src/components/BreadCrumbLink';

const CollectionBanner = ({ breadcrumbs }) => {
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
      {/* Custom Breadcrumbs positioned top left - Very light overlay, no border */}
      <div
        className="position-absolute top-0 start-0 z-2 m-3"
        style={{
          background: 'rgba(0,0,0,0.15)',
          borderRadius: '6px',
          backdropFilter: 'blur(1px)',
          padding: '6px 12px'
        }}
      >
        <nav className="d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="d-flex align-items-center">
              {index > 0 && (
                <span className="mx-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  ›
                </span>
              )}
              <BreadcrumbLink href={crumb.href} isLast={index === breadcrumbs.length - 1}>
                {crumb.name}
              </BreadcrumbLink>
            </div>
          ))}
        </nav>
      </div>

      <div className="text-center position-relative z-1">
        <h1 className="display-5 fw-bold mb-3">Explore All Track-Day Photos & Motorsport Images</h1>
        <h2 className="fs-6 mb-4">
          Search thousands of professionally captured car & bike track-day photos from photographers worldwide.
        </h2>
      </div>
    </div>
  );
};

export default CollectionBanner;
