'use client';
// react
import * as React from 'react';
import { sum } from 'lodash';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
import { useSelector, ReactReduxContext } from 'react-redux';
import { useSettingsFromCookies } from 'src/hooks/useSettingsFromCookies';

// mui
import { Box, Badge, Button } from '@mui/material';

// icons
import { HiOutlineHome, HiHome } from 'react-icons/hi';
import { IoSearch } from 'react-icons/io5';
import { BsShopWindow } from 'react-icons/bs';
import { FaBars, FaXmark } from 'react-icons/fa6';
import { HiShoppingBag, HiOutlineShoppingBag } from 'react-icons/hi';
import { FaRegUser } from 'react-icons/fa6';
import { FaUser } from 'react-icons/fa6';

// styles
import RootStyled from './styled';

// config
import config from 'src/layout/_main/config.json';

const getIcon = (href, totalItems) => {
  switch (href) {
    case '/':
      return <HiOutlineHome size={18} />;
    case '/race-track/collection':
      return <IoSearch size={18} />;
    case '/cart':
      return (
        <Badge
          showZero
          badgeContent={totalItems}
          color="error"
          max={99}
          sx={{ zIndex: 0, span: { top: '4px', right: '-2px' } }}
        >
          <HiOutlineShoppingBag size={18} />
        </Badge>
      );
    case '/products':
      return <BsShopWindow size={18} />;
    case '/menu':
      return <FaBars size={18} />;
    default:
      return <FaRegUser size={18} />;
  }
};

const getActiveIcon = (href, totalItems) => {
  switch (href) {
    case '/':
      return <HiHome size={18} />;
    case '/race-track/collection':
      return <IoSearch size={18} />;
    case '/cart':
      return (
        <Badge
          showZero={false}
          badgeContent={totalItems}
          color="error"
          max={99}
          sx={{ zIndex: 0, span: { top: '4px', right: '-2px' } }}
        >
          <HiShoppingBag size={18} />
        </Badge>
      );
    case '/products':
      return <BsShopWindow size={18} />;
    case '/menu':
      return <FaBars size={18} />;
    default:
      return <FaUser size={18} />;
  }
};

export default function MobileBar() {
  const { mobile_menu } = config;
  const { push } = useRouter();
  const pathname = usePathname();
  
  // Check if Redux is available
  const reduxContext = React.useContext(ReactReduxContext);
  
  // Get settings from cookies (works on both server and client)
  const cookieSettings = useSettingsFromCookies();
  
  // Get data from Redux or cookies
  let checkout = { cart: [] };
  let user = null;
  let isAuthenticated = false;
  let product = null;
  
  if (reduxContext) {
    const productState = useSelector(({ product }) => product);
    const userState = useSelector(({ user }) => user);
    product = productState; // Store full product state for isActiveIndex
    checkout = productState.checkout;
    user = userState.user;
    isAuthenticated = userState.isAuthenticated;
  } else {
    // Public route - get from cookies via hook (SSR-safe)
    checkout = { cart: cookieSettings.cart || [] };
    user = cookieSettings.user;
    isAuthenticated = cookieSettings.isAuthenticated;
  }
  
  const [index, setIndex] = React.useState(0);
  const [state, setState] = React.useState({
    product: null,
    user: null
  });

  const [cart, setCart] = React.useState([]);
  const totalItems = sum(cart.map((item) => item.quantity));
  const onChangeMenu = (href, i) => () => {
    push(href);
    setIndex(i);
  };
  
  // Stabilize checkout object reference using useMemo
  const stableCheckout = React.useMemo(() => checkout, [JSON.stringify(checkout.cart)]);
  
  React.useEffect(() => {
    const isActiveIndex = () => {
      // Don't update state - not needed
      const index =
        pathname.includes('/auth') || pathname.includes('/profile')
          ? 3
          : pathname.includes('/menu')
            ? 4
            : pathname.includes('/cart')
              ? 2
              : pathname.includes('/products') || pathname.includes('/product')
                ? 1
                : 0;

      setIndex(index);
    };
    isActiveIndex();
  }, [pathname]); // Only re-run when pathname changes

  React.useEffect(() => {
    setCart(stableCheckout.cart);
  }, [stableCheckout]); // Use stable reference

  return (
    <RootStyled>
      <Box className="appbar-wrapper">
        {mobile_menu.map((v, i) => (
          <Button
            variant={index === i ? 'contained' : 'text'}
            color={index === i ? 'primary' : 'inherit'}
            startIcon={
              index === i
                ? getActiveIcon(v.href, totalItems, state.notification)
                : getIcon(v.href, totalItems, state.notification)
            }
            key={Math.random()}
            size="large"
            className="nav-button"
            sx={{
              borderRadius: i === 0 ? '0 6px 0 0' : i === 4 ? '6px 0 0 0' : '6px 6px 0 0',
              fontWeight: index === i ? 600 : 400
            }}
            onClick={onChangeMenu(user?.isAuthenticated && v.isUser ? '/profile' : v.href, i)}
          >
            {v.name}
          </Button>
        ))}
      </Box>
    </RootStyled>
  );
}
