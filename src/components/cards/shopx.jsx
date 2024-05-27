'use client';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
// mui
import { Box, Card, Typography, Stack, IconButton, useTheme, useMediaQuery, Tooltip, Skeleton } from '@mui/material';
// redux
import { useDispatch } from 'src/lib/redux/store';
import { setWishlist } from 'src/lib/redux/slices/wishlist';
import { useSelector } from 'react-redux';
// next
import Link from 'src/utils/link';
import { useRouter } from 'src/hooks/useRouter';
// components
import Label from 'src/components/label';
import { fCurrency } from 'src/utils/formatNumber';
import BlurImage from 'src/components/blurImage';
// icons
import { IoMdHeartEmpty } from 'react-icons/io';
// api
import * as api from 'src/services';
// toast
import { toast } from 'react-hot-toast';
// icons

import { GoEye } from 'react-icons/go';

import { IoIosHeart } from 'react-icons/io';
import dynamic from 'next/dynamic';
import { FaRegStar } from 'react-icons/fa';
const ProductDetailsDialog = dynamic(() => import('../dialog/productDetails'));
export default function ShopProductCard({ ...props }) {
  const { item: product, isLoading: loading } = props;
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  // type error
  const { wishlist } = useSelector(({ wishlist }) => wishlist);
  const { isAuthenticated } = useSelector(({ user }) => user);
  const isTablet = useMediaQuery('(max-width:900px)');
  const [isLoading, setLoading] = useState(false);

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

  const { title, slug, logo, _id, averageRating } = !loading && product;
  const linkTo = `/product/${slug ? slug : ''}`;

  const onClickWishList = async (event) => {
    if (!isAuthenticated) {
      event.stopPropagation();
      router.push('/auth/login');
    } else {
      event.stopPropagation();
      setLoading(true);
      await mutate(_id);
    }
  };

  return (
    <Card
      sx={{
        display: 'block',
        my: 3,
        boxShadow:
          theme.palette.mode === 'light' ? '0 6px 16px rgba(145, 158, 171, 25%)' : '0 6px 16px rgb(5 6 6 / 25%)',
        '&:hover': {
          border: '1px solid ' + theme.palette.primary.main + '!important'
        }
      }}
    >
      <Box
        sx={{
          position: 'relative'
        }}
      >
        {!loading && product?.available < 1 && (
          <Label
            variant="filled"
            color={'error'}
            sx={{
              top: isTablet ? 8 : 12,
              left: isTablet ? 8 : 12,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
              fontSize: isTablet ? 8 : 12
            }}
          >
            Out of Stock
          </Label>
        )}
        <Box
          {...(product?.available > 0 && {
            component: Link,
            href: linkTo
          })}
          sx={{
            bgcolor: isLoading || loading ? 'transparent' : 'common.white',
            position: 'relative',
            cursor: 'pointer',

            '&:after': {
              content: `""`,
              display: 'block',
              paddingBottom: '100%'
            },
            width: '100%'
          }}
        >
          {loading ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              sx={{
                height: '100%',
                position: 'absolute'
              }}
            />
          ) : (
            <Box component={Link} href={linkTo}>
              <BlurImage
                alt={title}
                src={logo.url}
                fill
                draggable="false"
                objectFit="cover"
                placeholder="blur"
                blurDataURL={logo?.blurDataURL}
                // quality={15}
              />
            </Box>
          )}
        </Box>
      </Box>

      <Stack
        justifyContent="center"
        sx={{
          zIndex: 111,
          p: 1,
          width: '100%',

          a: {
            color: 'text.primary',
            textDecoration: 'none'
          }
        }}
      >
        <Box sx={{ display: 'grid' }}>
          {' '}
          <Typography
            sx={{
              cursor: 'pointer',
              textTransform: 'capitalize'
              // fontWeight: 500,
            }}
            {...(product?.available > 0 && {
              component: Link,
              href: linkTo
            })}
            variant={'subtitle1'}
            noWrap
          >
            {loading ? <Skeleton variant="text" width={120} /> : title}
          </Typography>
        </Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Typography
            variant="subtitle2"
            color="text.primary"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            {loading ? (
              <Skeleton variant="text" width={72} />
            ) : (
              <>
                <FaRegStar /> ({averageRating || 0})
              </>
            )}
          </Typography>
          {/* {loading ? <Skeleton variant="text" width={72} /> : <ColorPreviewGroup sx={{ minWidth: 72 }} />} */}
        </Stack>

        <Stack spacing={0.5} direction="row" justifyContent={'space-between'} alignItems="center">
          <Typography
            variant={isTablet ? 'body1' : 'h5'}
            component="p"
            sx={{
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              '& .discount': {
                fontSize: { md: 14, xs: 12 },
                fontWeight: 600,
                color: 'error.main',
                ml: 0.5
              }
            }}
          >
            {loading ? (
              <Skeleton variant="text" width={120} />
            ) : (
              <>
                <span>{fCurrency(product?.priceSale)}</span>
                <span className="discount">
                  ({`-${(100 - (product?.priceSale / product?.price) * 100).toFixed()}%`})
                </span>
              </>
            )}
          </Typography>
          <Stack direction={'row'}>
            {loading ? (
              <Skeleton variant="circular" width={isTablet ? 24 : 44} height={isTablet ? 24 : 44} />
            ) : (
              <Tooltip title="Add to cart">
                <IconButton
                  aria-label="add to cart"
                  disabled={loading || product?.available < 1}
                  onClick={() => setOpen(true)}
                  size={isTablet ? 'small' : 'medium'}
                >
                  <GoEye />
                </IconButton>
              </Tooltip>
            )}

            {loading ? (
              <Skeleton variant="circular" width={isTablet ? 24 : 44} height={isTablet ? 24 : 44} />
            ) : wishlist?.filter((v) => v === _id).length > 0 ? (
              <Tooltip title="Remove from cart">
                <IconButton
                  disabled={isLoading}
                  onClick={onClickWishList}
                  aria-label="add to cart"
                  color="primary"
                  size={isTablet ? 'small' : 'medium'}
                >
                  <IoIosHeart />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Add to wishlist">
                <IconButton
                  disabled={isLoading}
                  onClick={onClickWishList}
                  aria-label="add to wishlist"
                  size={isTablet ? 'small' : 'medium'}
                >
                  <IoMdHeartEmpty />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>
      </Stack>
      {open && <ProductDetailsDialog slug={product.slug} open={open} onClose={() => setOpen(false)} />}
    </Card>
  );
}
ShopProductCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    slug: PropTypes.string,
    sku: PropTypes.string,
    status: PropTypes.string,
    logo: PropTypes.shape({
      url: PropTypes.string.isRequired,
      blurDataURL: PropTypes.string // optional
    }).isRequired,
    price: PropTypes.number.isRequired,
    priceSale: PropTypes.number,
    available: PropTypes.number.isRequired,
    colors: PropTypes.arrayOf(PropTypes.string),
    averageRating: PropTypes.number
  }).isRequired,
  isLoading: PropTypes.bool.isRequired
};
