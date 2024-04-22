import PropTypes from 'prop-types';
// mui
import { Box } from '@mui/material';
// next
import Image from 'next/image';

export default function BlurImageAvatar({ ...props }) {
  return (
    <Box
      sx={{
        position: 'relative',
        height: 40,
        width: 40,
        borderRadius: '50%',
        overflow: 'hidden',
        ...props
      }}
    >
      <Image src={props.src} layout="fill" objectFit="cover" {...props} />
    </Box>
  );
}
BlurImageAvatar.propTypes = {
  src: PropTypes.string.isRequired
};
