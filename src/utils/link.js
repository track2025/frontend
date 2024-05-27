'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
export default function NextLink({ children, href, ...others }) {
  const pathname = usePathname();
  const segments = pathname.split('/');
  return (
    <Link href={`/${segments[1]}${href}`} {...others}>
      {children}
    </Link>
  );
}
