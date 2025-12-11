import PropTypes from 'prop-types';
import Link from 'next/link';

// mui
import { Box } from '@mui/material';
import Image from 'next/image';


export const Logo = () => {
  return (
    <Link href="/" style={{ textDecoration: 'none' }}>
      <Box
        sx={{
          cursor: 'pointer',
          width: { xs: 150, md: 250}
        }}
      >
        <Image
          src="/logo.png"
          alt="Logo"
          width={150}
          height={50}
          style={{ height: 'auto', width: '100%' }}
        />
      </Box>
    </Link>
  );
};

Logo.propTypes = {
  sx: PropTypes.object,
  isMobile: PropTypes.bool
};
export default Logo;
