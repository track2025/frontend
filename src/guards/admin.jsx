'use client';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// redux
import { useSelector } from 'src/redux';
import { toast } from 'react-hot-toast';
import Loading from 'src/components/loading';
// next
import { useRouter } from 'src/hooks/useRouter';

export default function Guest({ children }) {
  const router = useRouter();
  const [isAdmin, setAdmin] = useState(true);
  const { isAuthenticated, user } = useSelector(({ user }) => user);

  useEffect(() => {
    if (!isAuthenticated || !user.role === 'super admin' || !user.role === 'admin') {
      setAdmin(false);
      toast.error("You're not allowed to access dashboard");
      router.push('/auth/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isAdmin) {
    return <Loading />;
  }
  return children;
}

Guest.propTypes = {
  children: PropTypes.node.isRequired
};
