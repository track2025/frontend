'use client';
import React from 'react';
import { useRouter } from 'next-nprogress-bar';
// mui
import {
  Stack,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Switch,
  Container,
  useTheme
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
// react-icons
import { MdLogout } from 'react-icons/md';
import { AiOutlineHome } from 'react-icons/ai';
import { LuLayoutDashboard } from 'react-icons/lu';
import { IoMdSettings } from 'react-icons/io';
import { IoMoonOutline } from 'react-icons/io5';
import { MdKey } from 'react-icons/md';
import { LiaFileInvoiceSolid } from 'react-icons/lia';
import { IoIosHeartEmpty } from 'react-icons/io';
import { MdLogin } from 'react-icons/md';
import { FaRegUserCircle } from 'react-icons/fa';

import {
  IoImagesOutline,
  IoPersonOutline,
  IoShieldCheckmarkOutline,
  IoDocumentTextOutline,
  IoCameraOutline
} from 'react-icons/io5';

// redux
import { setThemeMode } from 'src/redux/slices/settings';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setLogout } from 'src/redux/slices/user';
import { resetWishlist } from 'src/redux/slices/wishlist';
import { deleteCookies } from 'src/hooks/cookies';

export default function Menu() {
  const { user, isAuthenticated } = useSelector(({ user }) => user);
  const { themeMode } = useSelector(({ settings }) => settings);
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const toggleThemeMode = (event) => {
    event.stopPropagation();
    dispatch(setThemeMode(themeMode === 'light' ? 'dark' : 'light'));
  };
  const isDeskTop = useMediaQuery(theme.breakpoints.up('md'));

  React.useEffect(() => {
    if (isDeskTop) {
      router.push('/profile/wishlist');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeskTop]);
  return (
    <Container maxWidth="xl">
      <List sx={{ mt: 5 }}>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <IoMoonOutline size={20} />
            </ListItemIcon>
            <ListItemText primary="Theme Mode" />
            <Switch checked={themeMode === 'dark'} onChange={toggleThemeMode} />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              router.push('/');
            }}
            sx={{ py: 2 }}
          >
            <ListItemIcon>
              <AiOutlineHome size={20} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              router.push('/photographers');
            }}
            sx={{ py: 2 }}
          >
            <ListItemIcon>
              <IoCameraOutline size={20} />
            </ListItemIcon>
            <ListItemText primary="Photographers" />
          </ListItemButton>
        </ListItem>

        <Divider />
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              router.push('/products?top=1');
            }}
            sx={{ py: 2 }}
          >
            <ListItemIcon>
              <IoImagesOutline size={20} />
            </ListItemIcon>
            <ListItemText primary="Collections" />
          </ListItemButton>
        </ListItem>

        <Divider />
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              router.push('/about');
            }}
            sx={{ py: 2 }}
          >
            <ListItemIcon>
              <IoPersonOutline size={20} />
            </ListItemIcon>
            <ListItemText primary="About Us" />
          </ListItemButton>
        </ListItem>

        <Divider />
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              router.push('/privacy-policy');
            }}
            sx={{ py: 2 }}
          >
            <ListItemIcon>
              <IoShieldCheckmarkOutline size={20} />
            </ListItemIcon>
            <ListItemText primary="Privacy Policy" />
          </ListItemButton>
        </ListItem>

        <Divider />
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              router.push('/terms-and-conditions');
            }}
            sx={{ py: 2 }}
          >
            <ListItemIcon>
              <IoDocumentTextOutline size={20} />
            </ListItemIcon>
            <ListItemText primary="Terms and Conditions" />
          </ListItemButton>
        </ListItem>

        {isAuthenticated && (
          <>
            <Divider />

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  router.push('/profile/wishlist');
                }}
                sx={{ py: 2 }}
              >
                <ListItemIcon>
                  <IoIosHeartEmpty size={20} />
                </ListItemIcon>
                <ListItemText primary="Wishlist" />
              </ListItemButton>
            </ListItem>

            <Divider />
          </>
        )}
      </List>
      <Stack spacing={2} mt={1} mb={4}>
        {isAuthenticated ? (
          <Button
            onClick={() => {
              deleteCookies('token');
              dispatch(setLogout());
              dispatch(resetWishlist());
              router.push('/');
            }}
            variant="outlined"
            color="inherit"
            startIcon={<MdLogout />}
            fullWidth
          >
            Logout
          </Button>
        ) : (
          <>
            <Button
              onClick={() => {
                router.push('/auth/login');
              }}
              variant="outlined"
              color="inherit"
              startIcon={<MdLogin />}
              fullWidth
            >
              Login
            </Button>
            <Button
              onClick={() => {
                router.push('/auth/register');
              }}
              variant="outlined"
              color="inherit"
              startIcon={<FaRegUserCircle />}
              fullWidth
            >
              Register
            </Button>
          </>
        )}
      </Stack>
    </Container>
  );
}
