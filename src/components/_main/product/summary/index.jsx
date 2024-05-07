// react
'use client';
import { useState, useEffect } from 'react';

// mui
import {
  Box,
  Stack,
  Button,
  IconButton,
  Typography,
  FormHelperText,
  Skeleton,
  Rating,
  useMediaQuery,
  Grid,
  Card,
  alpha,
  Divider
} from '@mui/material';
import { IoIosAdd, IoIosRemove } from 'react-icons/io';
import { IoLogoWhatsapp } from 'react-icons/io5';
import { FaFacebook } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FaLinkedin } from 'react-icons/fa';
import { MdContentCopy } from 'react-icons/md';
// next
import { useRouter } from 'next-nprogress-bar';
// formik
import { useFormik, Form, FormikProvider, useField } from 'formik';
// redux
import { useDispatch, useSelector } from 'src/lib/redux/store';
// redux
import { setWishlist } from 'src/lib/redux/slices/wishlist';
import { addCart } from 'src/lib/redux/slices/product';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton } from 'next-share';
// toast
import { toast } from 'react-hot-toast';
// api
import * as api from 'src/services';
import { useMutation } from 'react-query';
// styles
import RootStyled from './styled';
// components
import ColorPreview from 'src/components/colorPreview';
import SizePreview from 'src/components/sizePicker';
import { fCurrency } from 'src/utils/formatNumber';
import PropTypes from 'prop-types';
// icons
import { LiaShippingFastSolid } from 'react-icons/lia';
import { MdLockOutline } from 'react-icons/md';
import { FaRegStar } from 'react-icons/fa';
import { TbMessage } from 'react-icons/tb';

import { MdOutlineShoppingBasket } from 'react-icons/md';

ProductDetailsSumary.propTypes = {
  product: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  totalReviews: PropTypes.number.isRequired,
  totalRating: PropTypes.number.isRequired,
  brand: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  onClickWishList: PropTypes.func.isRequired,
  wishlist: PropTypes.array.isRequired
};

const Incrementer = ({ ...props }) => {
  const { available } = props;
  const [field, , helpers] = useField(props);
  // eslint-disable-next-line react/prop-types

  const { value } = field;
  const { setValue } = helpers;

  const incrementQuantity = () => {
    setValue(value + 1);
  };
  const decrementQuantity = () => {
    setValue(value - 1);
  };

  return (
    <Box className="incrementer">
      <IconButton size="small" color="inherit" disabled={value <= 1} onClick={decrementQuantity}>
        <IoIosRemove />
      </IconButton>
      <Typography variant="body2" component="span" className="text">
        {value}
      </Typography>
      <IconButton size="small" color="inherit" disabled={value >= available} onClick={incrementQuantity}>
        <IoIosAdd />
      </IconButton>
    </Box>
  );
};
Incrementer.propTypes = {
  available: PropTypes.number.isRequired
};
export default function ProductDetailsSumary({ ...props }) {
  const { product, isLoading, totalReviews, totalRating, brand, category, id } = props;
  const { isAuthenticated } = useSelector(({ user }) => user);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [color, setColor] = useState(0);
  const [size, setSize] = useState(0);
  useEffect(() => {
    setIsClient(true);
  }, []);

  console.log(product, 'product');
  const router = useRouter();

  const dispatch = useDispatch();

  const { checkout } = useSelector(({ product }) => product);

  const [isLoaded, setLoaded] = useState(false);

  const isMaxQuantity =
    !isLoading &&
    checkout.cart.filter((item) => item._id === product?._id).map((item) => item.quantity)[0] >= product?.available;

  const onAddCart = (param) => {
    toast.success('Added to cart');
    dispatch(addCart(param));
  };

  // wishlist
  const { mutate } = useMutation(api.updateWishlist, {
    onSuccess: (data) => {
      toast.success(data.message);
      setLoading(false);
      dispatch(setWishlist(data.data));
    },
    onError: (err) => {
      setLoading(false);
      const message = JSON.stringify(err?.response?.data?.message);
      toast.error(message);
    }
  });
  const onClickWishList = async (event) => {
    if (!isAuthenticated) {
      event.stopPropagation();
      router.push('/auth/login');
    } else {
      event.stopPropagation();
      setLoading(true);
      await mutate(id);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      pid: product?._id,
      cover: product?.cover,

      quantity: 1
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const alreadyProduct = !isLoading && checkout.cart.filter((item) => item.pid === values.pid);
        if (!Boolean(alreadyProduct.length)) {
          const colorSelected = product?.colors.find((_, index) => index === color);
          const sizeSelected = product?.sizes.find((_, index) => index === size);
          onAddCart({
            pid: product._id,
            sku: product.sku,
            color: colorSelected,
            size: sizeSelected,
            shop: product.shop,
            image: product?.images[0].url,
            quantity: values.quantity,
            price: product.priceSale === 0 ? product.price : product.priceSale,
            subtotal: (product.priceSale || product?.price) * values.quantity
          });
          setFieldValue('quantity', 1);
        }

        setSubmitting(false);
        router.push('/cart');
      } catch (error) {
        setSubmitting(false);
      }
    }
  });

  const { values, touched, errors, setFieldValue, handleSubmit } = formik;
  const handleAddCart = () => {
    const colorSelected = product?.colors.find((_, index) => index === color);
    const sizeSelected = product?.sizes.find((_, index) => index === size);
    onAddCart({
      pid: product._id,
      sku: product.sku,
      color: colorSelected,
      shop: product.shop,
      image: product?.images[0].url,
      size: sizeSelected,
      quantity: values.quantity,
      price: product.priceSale === 0 ? product.price : product.priceSale,
      subtotal: (product.priceSale || product?.price) * values.quantity
    });
    setFieldValue('quantity', 1);
  };

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <RootStyled>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Card sx={{ p: 2 }}>
                <Typography noWrap variant="h4" paragraph className="heading">
                  {product?.name}
                </Typography>
                <Typography variant="body1"> {product?.description}</Typography>

                <Stack spacing={1} mt={1} mb={3}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                    <Stack direction="row" alignItems="center" className="rating-wrapper" spacing={1}>
                      <Rating value={totalRating} precision={0.1} size="small" readOnly />
                      <Typography variant="body1">{totalReviews}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
                      <TbMessage size={18} />
                      <Typography variant="subtitle2" color="text.secondary">
                        {product?.reviews.length}{' '}
                        <span>{Number(product?.reviews.length) > 1 ? 'Reviews' : 'Review'}</span>
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
                      <MdOutlineShoppingBasket size={18} />
                      <Typography variant="subtitle2" color="text.secondary">
                        {product?.sold} sold
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1} mt={1.5}>
                    <Typography variant="subtitle1">Brand:</Typography>
                    <Typography variant="subtitle1" color="text.secondary" fontWeight={400}>
                      {brand?.name || 'Nextall'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle1">Category:</Typography>
                    <Typography variant="subtitle1" color="text.secondary" fontWeight={400}>
                      {category?.name || 'Nextall'}
                    </Typography>
                  </Stack>
                  {product?.price > product?.priceSale && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="subtitle1">Discount:</Typography>
                      <Typography variant="subtitle1" color="text.secondary" fontWeight={400} className="text-discount">
                        {!isLoading && isLoaded && fCurrency(product?.price - product?.priceSale)}
                        {<span>({(100 - (product?.priceSale / product?.price) * 100).toFixed(0)}% Discount)</span>}
                      </Typography>
                    </Stack>
                  )}
                  <Stack direction="row" alignItems="center" spacing={2} pt={1}>
                    <Typography variant="subtitle1">Color:</Typography>
                    <ColorPreview color={color} setColor={setColor} colors={product?.colors} isDetail />
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={2} pt={1}>
                    <Typography variant="subtitle1">Size:</Typography>
                    <SizePreview size={size} setSize={setSize} sizes={product?.sizes} isDetail />
                  </Stack>
                </Stack>
                <Stack spacing={2} className="detail-actions-wrapper">
                  <Stack direction="row">
                    <Stack direction="row" spacing={0.5}>
                      <IconButton
                        aria-label="copy"
                        onClick={() => {
                          navigator.clipboard.writeText(window?.location.href);
                          toast.success('Link copied.');
                        }}
                      >
                        <MdContentCopy size={24} />
                      </IconButton>
                      {isClient && (
                        <>
                          <WhatsappShareButton url={window?.location.href || ''}>
                            <IconButton sx={{ color: '#42BC50' }} aria-label="whatsapp">
                              <IoLogoWhatsapp size={24} />
                            </IconButton>
                          </WhatsappShareButton>
                          <FacebookShareButton url={window?.location.href || ''}>
                            <IconButton sx={{ color: '#1373EC' }} aria-label="facebook">
                              <FaFacebook size={24} />
                            </IconButton>
                          </FacebookShareButton>
                          <TwitterShareButton url={window?.location.href || ''}>
                            <IconButton sx={{ color: 'text.primary' }} aria-label="twitter">
                              <FaXTwitter size={24} />
                            </IconButton>
                          </TwitterShareButton>
                          <LinkedinShareButton url={window?.location.href || ''}>
                            <IconButton sx={{ color: '#0962B7' }} aria-label="linkedin">
                              <FaLinkedin size={24} />
                            </IconButton>
                          </LinkedinShareButton>
                        </>
                      )}
                    </Stack>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{ p: 2, position: 'sticky', top: 28 }}>
                <Typography variant="h4" className="text-price">
                  {!isLoading && isLoaded && fCurrency(product?.priceSale)} &nbsp;
                  {product?.price <= product?.priceSale ? null : (
                    <Typography component="span" className="old-price" color="text.secondary">
                      {!isLoading && isLoaded && fCurrency(product?.price)}
                    </Typography>
                  )}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} className="incrementer-wrapper" my={2}>
                  {isLoading ? (
                    <Box sx={{ float: 'right' }}>
                      <Skeleton variant="rounded" width={120} height={40} />
                    </Box>
                  ) : (
                    <div>
                      <Incrementer name="quantity" available={product?.available} />
                      {touched.quantity && errors.quantity && (
                        <FormHelperText error>{touched.quantity && errors.quantity}</FormHelperText>
                      )}
                    </div>
                  )}
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    fontWeight={400}
                    sx={{
                      span: {
                        color: 'error.main'
                      }
                    }}
                  >
                    {product?.available > 0 ? `${product?.available} Items` : <span>Out of stock</span>}
                  </Typography>
                </Stack>
                <Stack spacing={1} className="contained-buttons" mb={2}>
                  <Button
                    fullWidth
                    disabled={loading}
                    onClick={onClickWishList}
                    type="button"
                    color="primary"
                    variant="text"
                    sx={{
                      background: (theme) => alpha(theme.palette.primary.main, 0.3),
                      ':hover': {
                        background: (theme) => alpha(theme.palette.primary.main, 0.3)
                      }
                    }}
                  >
                    Add to Wishlist
                  </Button>

                  <Button
                    fullWidth
                    disabled={isMaxQuantity || isLoading || product?.available < 1}
                    // size={isMobile ? 'medium' : 'large'}
                    type="button"
                    color="primary"
                    variant="contained"
                    onClick={() => handleAddCart(product)}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    disabled={isLoading || product?.available < 1}
                    fullWidth
                    // size={isMobile ? 'medium' : 'large'}
                    type="submit"
                    variant="contained"
                    color="secondary"
                  >
                    Buy Now
                  </Button>
                </Stack>
                <Divider />
                {shippingData.map((item, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    my={1}
                    sx={{
                      color: 'text.secondary'
                    }}
                  >
                    {item.icon}
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.name}
                    </Typography>
                  </Stack>
                ))}
              </Card>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </RootStyled>
  );
}

const shippingData = [
  {
    icon: <LiaShippingFastSolid size={20} />,
    name: 'Worldwide shipping'
  },
  {
    icon: <MdLockOutline size={20} />,
    name: 'Secure payment'
  },
  {
    icon: <FaRegStar size={20} />,
    name: '2 years full warranty'
  }
];
