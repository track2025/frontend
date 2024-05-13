// mui
import { Badge, CardActionArea, IconButton, Stack, Typography, alpha } from '@mui/material';
import { HiOutlineShoppingBag } from 'react-icons/hi2';

// react
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// next
import { useRouter } from 'next-nprogress-bar';

// lodash
import { sum } from 'lodash';
import { useCurrencyConvert } from 'src/hooks/convertCurrency';
import { useCurrencyFormatter } from 'src/hooks/fCurrency';
import { useDispatch, useSelector } from 'react-redux';
import { getCart } from 'src/lib/redux/slices/product';
export default function CartWidget({ ...props }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    checkout: { cart }
  } = useSelector(({ product }) => product);
  const totalItems = sum(cart?.map((item) => item.quantity));
  const subtotal = sum(cart?.map((product) => product.price * product.quantity));
  const total = subtotal;
  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormatter();
  return (
    <Stack
      onClick={() => router.push('/cart')}
      direction="row"
      spacing={1}
      alignItems="center"
      width="auto"
      sx={{
        cursor: 'pointer'
      }}
    >
      <IconButton
        name="cart"
        disableRipple
        color="primary"
        sx={{
          borderColor: 'primary',
          borderWidth: 1,
          borderStyle: 'solid',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2)
        }}
      >
        {/* <Badge badgeContent={totalItems} color="primary" showZero> */}
        <HiOutlineShoppingBag />
        {/* </Badge> */}
      </IconButton>
      <Stack>
        <Typography variant="subtitle2" color="text.primary" mb={-0.6}>
          Cart ({totalItems})
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {fCurrency(cCurrency(total))}
        </Typography>
      </Stack>
    </Stack>
  );
}
CartWidget.propTypes = {
  checkout: PropTypes.object.isRequired
};
