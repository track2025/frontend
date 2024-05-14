'use client';
import { useState } from 'react';
import PropTypes from 'prop-types';
import RouterLink from 'src/utils/link';
import { FaAngleRight } from 'react-icons/fa6';

// material
import { alpha } from '@mui/material/styles';
import { Box, List, Card, ListItem, Typography, Stack, Button, Skeleton } from '@mui/material';
import Image from 'next/image';
import { useSelector } from 'react-redux';
// ----------------------------------------------------------------------

const ITEM_HEIGHT = 40;
// ----------------------------------------------------------------------

function ParentItem({ category, isLast, isLoading }) {
  const activeStyle = {
    color: 'primary.main',
    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity)
  };

  return (
    <ListItem
      href={'/products?category=' + category?.slug}
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
        '&:hover': activeStyle
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          component="span"
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {isLoading ? (
            <Skeleton variant="circular" width={32} height={32} />
          ) : (
            <Image src={category?.cover?.url} alt={category?.name} layout="fill" objectFit="cover" />
          )}
        </Box>
        <Typography variant="body1" color="text.primary" fontWeight={500}>
          {isLoading ? <Skeleton variant="text" width={120} /> : category?.name}
        </Typography>
      </Stack>
    </ListItem>
  );
}

MegaMenuItem.propTypes = {
  category: PropTypes.object,
  isLast: PropTypes.bool
};

function MegaMenuItem({ category, isLast, isLoading }) {
  return <ParentItem category={category} isLoading={isLoading} isLast={isLast} />;
}

export default function MegaMenuDesktopVertical({ ...other }) {
  const { categories, isLoading } = useSelector(({ categories }) => categories);

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
      {(isLoading ? Array.from(new Array(5)) : categories.slice(0, 5)).map((category, i) => (
        <MegaMenuItem key={Math.random()} isLoading={isLoading} category={category} isLast={i === 4} />
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
