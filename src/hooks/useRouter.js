'use client';
import { useRouter as useProgressRouter } from 'next-nprogress-bar';
import { usePathname } from 'next/navigation';
export const useRouter = () => {
  const router = useProgressRouter();
  const pathname = usePathname();

  const push = (href, isAlreadyPathname) => {
    return router.push(`${isAlreadyPathname ? '' : '/' + pathname.split('/')[1]}${href}`);
  };

  return { ...router, push };
};
