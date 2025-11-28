'use client';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next-nprogress-bar';
import { toast } from 'react-hot-toast';

// mui
import { Box, Typography, Stack, useMediaQuery, Skeleton, Chip } from '@mui/material';
// components
import { useDispatch } from 'src/redux';
import { setWishlist } from 'src/redux/slices/wishlist';
import { addCompareProduct, removeCompareProduct } from '../../redux/slices/compare';

import BlurImage from 'src/components/blurImage';
// hooks
import { useCurrencyConvert } from 'src/hooks/convertCurrency';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
// api
import * as api from 'src/services';
// icons
import { IoMdHeartEmpty } from 'react-icons/io';
import { GoGitCompare } from 'react-icons/go';
import { IoIosHeart } from 'react-icons/io';

export default function PhysicalProductCard({ ...props }) {
  const { product, loading } = props;
  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormatter();

  const [openActions, setOpenActions] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { wishlist } = useSelector(({ wishlist }) => wishlist);
  const { user } = useSelector(({ user }) => user);
  const { products: compareProducts } = useSelector(({ compare }) => compare);
  const isNotUser = user?.role === 'vendor' || user?.role?.includes('admin');

  const { isAuthenticated } = useSelector(({ user }) => user);
  const isTablet = useMediaQuery('(max-width:900px)');
  const [isLoading, setLoading] = useState(false);

  const { mutate } = useMutation({
    mutationFn: api.updateWishlist,
    onSuccess: (data) => {
      toast.success(data.message);
      setLoading(false);
      dispatch(setWishlist(data.data));
    },
    onError: (err) => {
      setLoading(false);
      const message = JSON.stringify(err?.response?.data?.message);
      toast.error(message ? t('common:' + JSON.parse(message)) : t('common:something-wrong'));
    }
  });

  const { name, slug, images, image, _id } = product || {};

  const linkTo = `/track-product/${slug ? slug : ''}${product?.variant ? `?variant=${product.variant}` : ''}`;

  const onClickWishList = async (event) => {
    if (isNotUser) {
      toast.error('Only user can add to wishlist');
      return;
    }
    if (!isAuthenticated) {
      event.stopPropagation();
      event.preventDefault();
      router.push('/auth/sign-in');
    } else {
      event.stopPropagation();
      event.preventDefault();
      setLoading(true);
      await mutate(_id);
    }
  };

  return (
    <Box
      component={Link}
      href={linkTo}
      onMouseEnter={() => !isLoading && setOpenActions(true)}
      onMouseLeave={() => setOpenActions(false)}
      sx={{
        display: 'block',
        position: 'relative',
        bgcolor: 'background.paper',
        borderRadius: 0,
        width: '100%',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        textDecoration: 'none',
        color: 'inherit',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
      }}
    >
      {/* Image Container */}
      <Box sx={{ position: 'relative' }}>
        {!loading && product?.stockQuantity < 1 && (
          <Chip
            size="small"
            sx={{
              top: 8,
              left: 8,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
              fontSize: 10,
              fontWeight: 600,
              height: 24,
            }}
            label="Out of Stock"
            color="error"
          />
        )}

        <Box
          sx={{
            position: 'relative',
            cursor: 'pointer',
            aspectRatio: '1 / 1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <Skeleton variant="rectangular" width="100%" height="100%" />
          ) : (
            <BlurImage
              alt={name || 'Product image'}
              src={images?.[0]?.url || image?.url || '/placeholder.jpg'}
              fill
              draggable="false"
              sizes="(max-width: 200px) 50vw, 20vw"
              quality={75}
              priority={false}
              placeholder="blur"
              blurDataURL={images?.[0]?.blurDataURL || '/images/placeholder.jpg'}
              style={{
                objectFit: 'contain', // keeps padding space
                padding: '6px',
                transition: 'transform 0.3s ease',
              }}
              className="product-image"
            />
          )}
        </Box>
      </Box>

      {/* Content */}
      <Stack
        spacing={1}
        sx={{
          p: 2,
          pt: 1.5,
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between', // ✅ evenly space name & price
        }}
      >
        {/* Product Name */}
        <Typography
          sx={{
            cursor: product?.stockQuantity > 0 ? 'pointer' : 'default',
            textTransform: 'capitalize',
            fontWeight: 600,
            fontSize: '0.95rem',
            lineHeight: 1.3,
            overflow: 'hidden',
            display: '-webkit-box',
            textAlign: 'center',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            '&:hover': {
              color: product?.stockQuantity > 0 ? 'primary.main' : 'inherit',
            },
          }}
          variant="body1"
        >
          {loading ? <Skeleton variant="text" width="100%" /> : name}
        </Typography>

        {/* Price Section */}
        <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
          <Typography
            variant="h6"
            component="p"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
            }}
          >
            {loading ? (
              <Skeleton variant="text" width={80} />
            ) : (
              fCurrency(cCurrency(product?.salePrice))
            )}
          </Typography>

          {!loading && product?.salePrice < product?.price && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.disabled',
                textDecoration: 'line-through',
                fontWeight: 500,
              }}
            >
              {fCurrency(cCurrency(product?.price))}
            </Typography>
          )}
        </Stack>
      </Stack>

    </Box>
  );
}

PhysicalProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string,
    sku: PropTypes.string,
    status: PropTypes.string,
    images: PropTypes.array.isRequired,
    price: PropTypes.number.isRequired,
    salePrice: PropTypes.number,
    stockQuantity: PropTypes.number,
    colors: PropTypes.array,
    averageRating: PropTypes.number,
    variant: PropTypes.string,
    rating: PropTypes.number,
    reviewCount: PropTypes.number,
    type: PropTypes.string
  }),
  loading: PropTypes.bool.isRequired
};
