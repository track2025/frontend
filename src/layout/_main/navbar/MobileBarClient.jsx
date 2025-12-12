'use client';
import dynamic from 'next/dynamic';

const MobileBar = dynamic(() => import('src/layout/_main/mobileBar'));

export default function MobileBarClient() {
  return <MobileBar />;
}
