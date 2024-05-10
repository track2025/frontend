'use client';
import { useState } from 'react';
import PropTypes from 'prop-types';
import RouterLink from 'next/link';
import { FaAngleRight } from 'react-icons/fa6';

// material
import { alpha } from '@mui/material/styles';
import { Box, List, Card, ListItem, Typography, Stack, Button } from '@mui/material';
import { IoShirtOutline } from 'react-icons/io5';
import navConfig from './MenuConfig';
import { useSelector } from 'react-redux';
// ----------------------------------------------------------------------

const ITEM_HEIGHT = 40;
// ----------------------------------------------------------------------

function ParentItem({ slug, name }) {
  const activeStyle = {
    color: 'primary.main',
    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity)
  };

  return (
    <ListItem
      href={'/products?category=' + slug}
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
        borderBottom: (theme) => `1px solid ${isLast ? 'transparent' : theme.palette.divider}`,
        '&:hover': activeStyle,
        ...(open && activeStyle)
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          component="span"
          sx={{
            bgcolor: 'background.default',
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
          {name}
        </Typography>
      </Stack>
    </ListItem>
  );
}

MegaMenuItem.propTypes = {
  category: PropTypes.object,
  isLast: PropTypes.bool
};

function MegaMenuItem({ category, isLast }) {
  const { name, slug } = category;

  return (
    <ParentItem slug={slug} name={name} isLast={isLast}>
      {name}
    </ParentItem>
  );
}

export default function MegaMenuDesktopVertical({ ...other }) {
  const { categories, isLoading } = useSelector(({ categories }) => categories);
  console.log(categories, isLoading, 'categories, isLoading');
  return (
    <List
      component={Card}
      disablePadding
      {...other}
      sx={{
        minWidth: 280,
        bgcolor: 'background.paper',
        borderRadius: '12px',
        height: 343,
        overflowY: 'auto',
        overflowX: 'auto',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        display: { md: 'flex', xs: 'none' },
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      {!isLoading &&
        categories
          .slice(0, 5)
          .map((category, i) => <MegaMenuItem key={category.name} category={category} isLast={i === 4} />)}
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
