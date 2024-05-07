// react
import React from 'react';

// next
import { useRouter } from 'next-nprogress-bar';

// mui
import { IconButton, Stack, Typography, alpha } from '@mui/material';
import { IoMdHeartEmpty } from 'react-icons/io';
import { useSelector } from 'react-redux';

import PropTypes from 'prop-types';

WishlistPopover.propTypes = {
  isAuth: PropTypes.bool.isRequired
};

// ----------------------------------------------------------------------
export default function WishlistPopover({ isAuth }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const { wishlist } = useSelector(({ wishlist }) => wishlist);

  React.useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center" width="auto">
        <IconButton
          name="wishlist"
          color="primary"
          sx={{
            borderColor: 'primary',
            borderWidth: 1,
            borderStyle: 'solid',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2)
          }}
          onClick={() => {
            if (!isAuth) {
              router.push('/auth/login');
            } else {
              router.push('/profile/wishlist');
            }
          }}
        >
          <IoMdHeartEmpty />
        </IconButton>
        <Stack>
          <Typography variant="subtitle2" color="text.primary" mb={0}>
            Wishlist
          </Typography>
          <Typography variant="body1" color="text.primary">
            {wishlist?.length} Items
          </Typography>
        </Stack>
      </Stack>
    </>
  );
}
