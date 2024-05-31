'use client';
import React, { useState } from 'react';
// mui
import {
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

// api
import * as api from 'src/services';

import Image from 'next/image';

import imageUrl from '../../../../public/images/product.png';
import { useSelector, useDispatch } from 'react-redux';
import { removeCompareProduct } from 'src/redux/slices/compare';
import { useRouter } from 'next-nprogress-bar';
import toast from 'react-hot-toast';
import { setWishlist } from 'src/redux/slices/wishlist';
import { useMutation } from 'react-query';
// import { addCart } from 'src/redux/slices/product';

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
  }
];
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
    overflow: 'hidden'
  }
}));

const CompareTable = () => {
  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const { mutate } = useMutation(api.updateWishlist, {
    onSuccess: (data) => {
      toast.success(data.message);
      setLoading(false);
      dispatch(setWishlist(data.data));
    },
    onError: (err) => {
      setLoading(false);
      const message = JSON.stringify(err.response.data.message);
      toast.error(t(message ? t('common:' + JSON.parse(message)) : t('common:something-wrong')));
    }
  });

  const { products: compareProducts } = useSelector(({ compare }) => compare);
  const { isAuthenticated } = useSelector(({ user }) => user);

  const findProductById = compareProducts.find((product) => product._id);

  const onClickWishList = async (event) => {
    if (!isAuthenticated) {
      event.stopPropagation();
      router.push('/auth/login');
    } else {
      event.stopPropagation();
      setLoading(true);
      await mutate(findProductById._id);
    }
  };

  // const handleAddCart = () => {
  //   const colorSelected = compareProducts?.colors.find((_, index) => index === color);
  //   const sizeSelected = compareProducts?.sizes.find((_, index) => index === size);
  //   onAddCart({
  //     pid: compareProducts._id,
  //     sku: compareProducts.sku,
  //     color: colorSelected,

  //     image: compareProducts?.images[0].url,
  //     size: sizeSelected,
  //     quantity: values.quantity,
  //     price: compareProducts.priceSale === 0 ? compareProducts.price : compareProducts.priceSale,
  //     subtotal: (compareProducts.priceSale || compareProducts?.price) * values.quantity
  //   });
  //   setFieldValue('quantity', 1);
  // };

  const onRemoveCompare = async (event) => {
    event.stopPropagation();
    dispatch(removeCompareProduct(findProductById._id));
  };

  console.log(findProductById, 'product asdsa');

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
            {compareProducts.map((product) => (
              <TableCell key={product.id} align="left" sx={{ minWidth: 292 }}>
                <Stack sx={{ position: 'relative' }}>
                  <IconButton
                    onClick={onRemoveCompare}
                    aria-label="Remove from compare"
                    sx={{ position: 'absolute', top: 0, right: 0, zIndex: 50 }}
                  >
                    <IoIosCloseCircle />
                  </IconButton>
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: { md: 320, sm: 170, xs: 150 },
                      borderRadius: 2,
                      overflow: 'hidden'
                    }}
                  >
                    <Image
                      src={product.image.url}
                      alt={product.title}
                      fill
                      objectFit="cover"
                      placeholder="blur"
                      blurDataURL={product.image.blurDataURL}
                    />
                  </Box>

                  <Typography variant="h6" sx={{ marginY: { md: 2, xs: 1 } }}>
                    {product.name}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{
                        paddingX: { md: 0, xs: '12px !important ' },
                        minWidth: { md: 'auto', xs: '48px !important ' }
                      }}
                      // onClick={() => handleAddCart(product)}
                    >
                      <IoCartOutline style={{ fontSize: 24 }} />
                      <Typography
                        variant="body1"
                        color="common.white"
                        sx={{
                          display: { md: 'block', xs: 'none' },
                          ml: 1,
                          fontWeight: 500
                        }}
                      >
                        Add To Cart
                      </Typography>
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      disabled={isLoading}
                      onClick={onClickWishList}
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
            {compareProducts.map((product) => (
              <TableCell key={product.id} align="left" sx={{ fontSize: 16, color: 'text.secondary' }}>
                <Stack direction="row" alignItems="center">
                  <Rating size="small" name="read-only" precision={0.5} value={product.averageRating} readOnly />(
                  {product.averageRating || 0})
                </Stack>
              </TableCell>
            ))}
          </StyledTableRow>
          <StyledTableRow>
            <TableCell component="th" sx={{ fontWeight: 600, fontSize: 16 }}>
              Price
            </TableCell>
            {compareProducts.map((product) => (
              <TableCell key={product.id} align="left" sx={{ fontWeight: 600, fontSize: 16, color: 'info.main' }}>
                ${product.priceSale}
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
