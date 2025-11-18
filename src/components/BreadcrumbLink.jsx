'use client';

import Link from 'next/link';
import React from 'react';

const BreadcrumbLink = ({ href, children, isLast }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  if (isLast) {
    return (
      <span
        className="fw-medium"
        style={{
          color: '#fff',
          textShadow: '0 1px 2px rgba(0,0,0,0.8)'
        }}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="text-decoration-none"
      style={{
        color: isHovered ? '#EE1E50' : 'rgba(255,255,255,0.9)',
        transition: 'color 0.2s ease'
      }}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
};

export default BreadcrumbLink;
