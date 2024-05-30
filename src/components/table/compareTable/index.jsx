// App.js
'use client';
import React from 'react';
// mui
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  TableHead,
  Box,
  Stack,
  Rating,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
// icons
import { IoCartOutline } from 'react-icons/io5';
import { FiHeart } from 'react-icons/fi';
import { IoIosCloseCircle } from 'react-icons/io';

import Image from 'next/image';

import imageUrl from '../../../../public/images/product.png';
import { useSelector } from 'react-redux';

const products = [
  {
    id: 1,
    imagePath: imageUrl,
    title: 'Blue Sports Shoes',
    price: '$699.00',
    rating: 4.5,
    shop: 'Clicon',
    brand: 'Tissot',
    stock: 'IN STOCK',
    size: '6.7 inches, 110.5 cm'
  },
  {
    id: 2,
    imagePath: imageUrl,
    title: 'Blue Sports Shoes',
    price: '$599.00',
    rating: 4.7,
    shop: 'Apple',
    brand: 'Apple',
    stock: 'IN STOCK',
    size: '6.7 inches, 101.8 cm'
  },

  {
    id: 3,
    imagePath: imageUrl,
    title: 'Blue Sports Shoes',
    price: '$699.99',
    rating: 4.9,
    shop: 'Clicon',
    brand: 'Clicon',
    stock: 'OUT OF STOCK',
    size: '6.4 inches, 98.3 cm'
  }
];
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
    overflow: 'hidden'
  }
}));

const CompareTable = ({ ...props }) => {
  const { products: compareProducts } = useSelector(({ compare }) => compare);

  console.log(compareProducts, 'product asdsa');

  return (
    <TableContainer>
      <Table
        sx={{
          borderCollapse: 'separate',
          '& td, & th': {
            border: 1,
            borderColor: (theme) => theme.palette.action.hover
          }
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell maxWidth="400px"></TableCell>
            {products.map((product) => (
              <TableCell key={product.id} align="left" sx={{ minWidth: 292 }}>
                <Stack sx={{ position: 'relative' }}>
                  <IconButton aria-label="" sx={{ position: 'absolute', top: 0, right: 0, zIndex: 50 }}>
                    <IoIosCloseCircle />
                  </IconButton>
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: { md: 280, sm: 170, xs: 150 },
                      borderRadius: 2,
                      overflow: 'hidden'
                    }}
                  >
                    <Image src={product.imagePath} alt={product.title} fill objectFit="cover" />
                  </Box>

                  <Typography variant="h6" sx={{ marginY: { md: 2, xs: 1 } }}>
                    {product.title}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button variant="contained" color="primary" size="large" fullWidth>
                      <IoCartOutline style={{ fontSize: 24 }} />
                      <Typography
                        variant="body1"
                        color="common.white"
                        sx={{ display: { md: 'block', xs: 'none' }, ml: 1, fontWeight: 500 }}
                      >
                        Add To Cart
                      </Typography>
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{ paddingX: '12px !important ', minWidth: '48px !important ' }}
                    >
                      <FiHeart style={{ fontSize: 20 }} />
                    </Button>
                  </Stack>
                </Stack>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <StyledTableRow>
            <TableCell sx={{ minWidth: 275, fontWeight: 600, fontSize: 16 }} component="th">
              Customer Feedback
            </TableCell>
            {products.map((product) => (
              <TableCell key={product.id} align="left" sx={{ fontSize: 16, color: 'text.secondary' }}>
                <Stack direction="row" alignItems="center">
                  <Rating size="small" name="read-only" value={product.rating} readOnly />( {product.rating})
                </Stack>
              </TableCell>
            ))}
          </StyledTableRow>
          <StyledTableRow>
            <TableCell component="th" sx={{ fontWeight: 600, fontSize: 16 }}>
              Price
            </TableCell>
            {products.map((product) => (
              <TableCell key={product.id} align="left" sx={{ fontWeight: 600, fontSize: 16, color: 'info.main' }}>
                {product.price}
              </TableCell>
            ))}
          </StyledTableRow>
          <StyledTableRow>
            <TableCell component="th" sx={{ fontWeight: 600, fontSize: 16 }}>
              Shop by
            </TableCell>
            {products.map((product) => (
              <TableCell key={product.id} align="left" sx={{ fontSize: 14 }}>
                {product.shop}
              </TableCell>
            ))}
          </StyledTableRow>
          <StyledTableRow>
            <TableCell component="th" sx={{ fontWeight: 600, fontSize: 14 }}>
              Brand
            </TableCell>
            {products.map((product) => (
              <TableCell key={product.id} align="left" sx={{ fontSize: 16 }}>
                {product.brand}
              </TableCell>
            ))}
          </StyledTableRow>
          <StyledTableRow>
            <TableCell component="th" sx={{ fontWeight: 600, fontSize: 16 }}>
              Stock status
            </TableCell>
            {products.map((product) => (
              <TableCell key={product.id} align="left" sx={{ fontSize: 16, color: 'success.main' }}>
                {product.stock}
              </TableCell>
            ))}
          </StyledTableRow>
          <StyledTableRow>
            <TableCell component="th" sx={{ fontWeight: 600, fontSize: 16 }}>
              Sizes
            </TableCell>
            {products.map((product) => (
              <TableCell key={product.id} align="left" sx={{ fontSize: 14 }}>
                {product.size}
              </TableCell>
            ))}
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CompareTable;
