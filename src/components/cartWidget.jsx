import PropTypes from 'prop-types';
import { sum } from 'lodash';
import { useSelector } from 'react-redux';
import { useRouter } from 'next-nprogress-bar';

// mui
import { Badge, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { HiOutlineShoppingBag } from 'react-icons/hi2';

// custom hooks
import { useCurrencyConvert } from 'src/hooks/convertCurrency';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';

export default function CartWidget() {
  const {
    checkout: { cart }
  } = useSelector(({ product }) => product);
  
  const router = useRouter();
  const totalItems = sum(cart?.map((item) => item.quantity));
  const subtotal = sum(cart?.map((product) => (product.priceSale || product.price) * product.quantity));
  const total = subtotal;
  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormatter();
  const theme = useTheme();

  return (
    <Stack
      onClick={() => router.push('/cart')}
      direction="row"
      spacing={1}
      alignItems="center"
      width="auto"
      sx={{ cursor: 'pointer' }}
    >
      <Badge badgeContent={totalItems} color="error" overlap="circular">
        <IconButton name="cart" disableRipple color="primary">
          <HiOutlineShoppingBag />
        </IconButton>
      </Badge>

      <Stack>
        <Typography variant="body1" sx={{ color: 'text.primary' }}>
          {fCurrency(cCurrency(total))}
        </Typography>
      </Stack>
    </Stack>
  );
}

CartWidget.propTypes = {
  checkout: PropTypes.object.isRequired
};
