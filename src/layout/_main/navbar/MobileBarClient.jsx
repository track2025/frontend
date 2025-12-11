'use client';
import dynamic from 'next/dynamic';

const MobileBar = dynamic(() => import('src/layout/_main/mobileBar'), {
  ssr: false
});

export default function MobileBarClient() {
  return <MobileBar />;
}
