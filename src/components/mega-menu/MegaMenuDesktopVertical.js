'use client';
import { useState } from 'react';
import PropTypes from 'prop-types';
import RouterLink from 'next/link';
// import { NavLink as RouterLink } from 'react-router-dom';
import { FaAngleRight } from 'react-icons/fa6';

// material
import { alpha } from '@mui/material/styles';
import { Box, Link, List, Paper, ListItem, Typography, Divider, Stack, Button } from '@mui/material';
import { IoShirtOutline } from 'react-icons/io5';

//
// import MenuHotProducts from './MenuHotProducts';
// import MegaMenuCarousel from './MegaMenuCarousel';
import navConfig from './MenuConfig';
// ----------------------------------------------------------------------

const MENU_WIDTH = 280;
const MENU_PAPER_WIDTH = 800;
const CONTENT_HEIGHT = 400;
const ITEM_HEIGHT = 40;
const ITEM_ON_ROW = {
  width: 'calc((100%/3) - 16px)',
  '&:nth-of-type(3n+1)': { order: 1 },
  '&:nth-of-type(3n+2)': { order: 2 },
  '&:nth-of-type(3n)': { order: 3 }
};

// ----------------------------------------------------------------------

ParentItem.propTypes = {
  path: PropTypes.string,
  title: PropTypes.string,
  open: PropTypes.bool,
  hasSub: PropTypes.bool
};

function ParentItem({ path, title, open, hasSub, ...other }) {
  const activeStyle = {
    color: 'primary.main',
    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity)
  };

  return (
    <ListItem
      href={path || '/'}
      component={RouterLink}
      sx={{
        padding: (theme) => theme.spacing(3.5, 2),
        height: ITEM_HEIGHT,
        cursor: 'pointer',
        color: 'text.primary',
        typography: 'subtitle2',
        textTransform: 'capitalize',
        justifyContent: 'space-between',
        transition: (theme) => theme.transitions.create('all'),
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        '&:hover': activeStyle,
        ...(open && activeStyle)
      }}
      {...other}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          component="span"
          sx={{
            bgcolor: (theme) => theme.palette.grey[300],
            width: 32,
            height: 32,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%'
          }}
        >
          <IoShirtOutline />
        </Box>
        <Typography variant="body1" color="text.primary" fontWeight={500}>
          {title}
        </Typography>
      </Stack>
      {hasSub && <Box component={FaAngleRight} sx={{ ml: 1, width: 10, height: 10 }} />}
    </ListItem>
  );
}

MegaMenuItem.propTypes = {
  parent: PropTypes.object
};

function MegaMenuItem({ parent }) {
  const { title, path, more, products, tags, children } = parent;
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (children) {
    return (
      <>
        <ParentItem onMouseEnter={handleOpen} onMouseLeave={handleClose} path={path} title={title} open={open} hasSub>
          {title}
        </ParentItem>

        {open && (
          <Paper
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
            sx={{
              p: 3,
              top: -2,
              left: MENU_WIDTH,
              width: MENU_PAPER_WIDTH,
              borderRadius: 2,
              zIndex: 100,
              position: 'absolute',
              boxShadow: (theme) => theme.customShadows.z20
            }}
          >
            <Stack flexWrap="wrap" alignContent="space-between" height={CONTENT_HEIGHT} sx={{}}>
              {children.map((list) => {
                const { subheader, items } = list;

                return (
                  <Stack key={subheader} spacing={1.25} sx={{ mb: 2.5, ...ITEM_ON_ROW }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'fontWeightBold' }} noWrap>
                      {subheader}
                    </Typography>
                    {items.map((link) => (
                      <Link
                        noWrap
                        key={link.title}
                        component={RouterLink}
                        href={link?.path || '/'}
                        underline="none"
                        sx={{
                          typography: 'body2',
                          color: 'text.primary',
                          fontSize: 13,
                          transition: (theme) => theme.transitions.create('all'),
                          '&:hover': { color: 'primary.main' }
                        }}
                      >
                        {link.title}
                      </Link>
                    ))}
                  </Stack>
                );
              })}
            </Stack>
          </Paper>
        )}
      </>
    );
  }

  return (
    <ParentItem path={path} title={title}>
      {title}
    </ParentItem>
  );
}

export default function MegaMenuDesktopVertical({ ...other }) {
  return (
    <List
      disablePadding
      {...other}
      sx={{
        minWidth: 280,
        bgcolor: '#fff',
        borderRadius: '8px',
        height: 343,
        overflowY: 'auto',
        overflowX: 'auto',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        display: { md: 'block', xs: 'none' }
      }}
    >
      {navConfig.slice(0, 5).map((parent) => (
        <MegaMenuItem key={parent.title} parent={parent} />
      ))}
      <Button
        variant="outlined"
        fullWidth
        endIcon={<FaAngleRight size={14} />}
        sx={{
          bgcolor: (theme) => theme.palette.primary.extraLight + '!important',
          color: (theme) => theme.palette.primary.dark,
          border: 'none !important',
          borderRadius: 'unset',
          paddingY: (theme) => theme.spacing(3.5)
        }}
      >
        View All
      </Button>
    </List>
  );
}
