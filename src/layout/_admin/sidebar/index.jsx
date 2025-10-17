import React from 'react';
import PropTypes from 'prop-types';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';

// mui
import {
  styled,
  useTheme,
  alpha,
  useMediaQuery,
  Fab,
  Box,
  ListItemText,
  List,
  Tooltip,
  ListItem,
  ListItemButton,
  ListItemIcon
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';

// components
import Scrollbar from 'src/components/Scrollbar';

// Dashboard Side NevLinks
import { LuBadgePercent } from 'react-icons/lu';
import { SlEnvolopeLetter } from 'react-icons/sl';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { IoSettingsOutline } from 'react-icons/io5';
import { LuLayoutDashboard, LuUsers } from "react-icons/lu";
import { TbCategory2 } from "react-icons/tb";
import { FaRegBuilding } from "react-icons/fa";
import { BsShop, BsCart3, BsBuildings, BsCashCoin } from "react-icons/bs";
import { RiCoupon5Line } from "react-icons/ri";
import { AiOutlineDollarCircle } from "react-icons/ai";

export const navlinks = [
  {
    id: 1,
    title: "Dashboard",
    slug: "dashboard",
    icon: <LuLayoutDashboard />,
  },
  {
    id: 2,
    title: "Vehicle Makes",
    slug: "vehicle-makes",
    icon: <TbCategory2 />,
    isSearch: true,
  },
  {
    id: 3,
    title: "Vehicle Models",
    slug: "vehicle-models",
    icon: <TbCategory2 />,
    isSearch: true,
  },
  {
    id: 4,
    title: "Race Locations",
    slug: "locations",
    icon: <FaRegBuilding />,
    isSearch: true,
  },
  {
    id: 5,
    title: "Media Files",
    slug: "products",
    icon: <BsShop />,
    isSearch: true,
  },
  {
    id: 6,
    title: "Orders",
    slug: "orders",
    icon: <BsCart3 />,
    isSearch: true,
  },
  {
    id: 7,
    title: "Photographers",
    slug: "photographers",
    icon: <BsBuildings />,
    isSearch: true,
  },
  {
    id: 8,
    title: "Users",
    slug: "users",
    icon: <LuUsers />,
    isSearch: true,
  },
  {
    id: 9,
    title: "Payouts",
    slug: "payouts",
    icon: <BsCashCoin />,
    isSearch: false,
  },
  {
    id: 10,
    title: "Coupon Codes",
    slug: "coupon-codes",
    icon: <RiCoupon5Line />,
    isSearch: true,
  },
  {
    id: 11,
    title: "Currencies",
    slug: "currencies",
    icon: <AiOutlineDollarCircle />,
    isSearch: true,
  },
  {
    id: 12,
    title: "Settings",
    slug: "settings",
    icon: <IoSettingsOutline />,
    isSearch: false,
  },
  // Physical Products Section
  {
    id: 13,
    title: "Brands",
    slug: "physical-brands",
    icon: <TbCategory2 />,
    isSearch: true,
  },
  {
    id: 15,
    title: 'Categories',
    slug: 'physical-categories',
    icon: <TbCategory2 />,
    isSearch: true
  },
  {
    id: 16,
    title: 'Sub Categories',
    slug: 'physical-categories/sub-categories',
    icon: <TbCategory2 />,
    isSearch: true
  },
  {
    id: 17,
    title: 'Child Categories',
    slug: 'physical-categories/child-categories',
    icon: <TbCategory2 />,
    isSearch: true
  },
  {
    id: 18,
    title: "Products",
    slug: "physical-products",
    icon: <BsShop />,
    isSearch: true,
  },
];

const drawerWidth = 240;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden',
  borderRadius: 0,
  [theme.breakpoints.down('md')]: {
    position: 'fixed'
  }
});
const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `0px`,
  borderRadius: 0,
  [theme.breakpoints.up('md')]: {
    width: `calc(${theme.spacing(9)} + 1px)`
  },
  [theme.breakpoints.down('md')]: {
    position: 'fixed'
  }
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  width: drawerWidth,
  zIndex: 11,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',

  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme)
  })
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar
}));

export default function Sidebar({ handleDrawerClose, handleDrawerOpen, open }) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = React.useState('');
  const [initial, setInitial] = React.useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  React.useEffect(() => {
    setActive(pathname);
    setInitial(true);
  }, [pathname]);
  return (
    <div>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          '&.MuiDrawer-root': {
            '.MuiPaper-root': {
              overflow: { xs: 'hidden', md: 'unset' },
              zIndex: 998 + '!important'
            }
          }
        }}
      >
        <DrawerHeader />
        <Box
          sx={{
            position: 'absolute',
            right: -15,
            top: 85,
            zIndex: 9999999,
            display: { xs: 'none', md: 'flex' }
          }}
        >
          <Fab
            size="small"
            aria-label="open drawer"
            onClick={open ? handleDrawerClose : handleDrawerOpen}
            edge="start"
            sx={{
              bgcolor: theme.palette.background.paper,
              border: '1px solid' + theme.palette.divider,
              boxShadow: 'none',
              height: 25,
              minHeight: 25,
              width: 25,
              ':hover': {
                bgcolor: theme.palette.background.paper
              },
              svg: {
                color: theme.palette.text.primary
              }
            }}
          >
            {open ? <IoIosArrowBack /> : <IoIosArrowForward />}
          </Fab>
        </Box>
        <Scrollbar
          sx={{
            height: 1,
            '& .simplebar-content': {
              height: 1,
              display: 'flex',
              flexDirection: 'column'
            }
          }}
        >
          <List
            sx={{
              px: 1.5,
              gap: 1,
              display: 'flex',
              flexDirection: 'column',
              py: 2
            }}
          >
            {navlinks.map((item) => (
              <ListItem
                key={item.id}
                disablePadding
                sx={{
                  display: 'block',
                  borderRadius: '8px',
                  border: `1px solid transparent`,
                  ...(active === '/admin/' + item.slug &&
                    initial && {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                    border: (theme) => `1px solid ${theme.palette.primary.main}`,
                    color: theme.palette.primary.main,
                    '& .MuiTypography-root': {
                      fontWeight: 600
                    }
                  })
                }}
              >
                <Tooltip title={open ? '' : item.title} placement="left" arrow leaveDelay={200}>
                  <ListItemButton
                    onClick={() => {
                      setActive(item.slug);
                      router.push('/admin/' + item.slug);
                      isMobile && handleDrawerClose();
                    }}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      borderRadius: '8px'
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 'auto',
                        justifyContent: 'center'
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    <ListItemText
                      primary={item.title}
                      sx={{
                        overflow: 'hidden',
                        height: open ? 'auto' : 0,
                        textTransform: 'capitalize'
                      }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Scrollbar>
      </Drawer>
    </div>
  );
}
Sidebar.propTypes = {
  handleDrawerClose: PropTypes.func.isRequired,
  handleDrawerOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};
