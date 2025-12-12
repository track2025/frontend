'use client';
import { useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { useSelector, ReactReduxContext } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next-nprogress-bar';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';

// mui
import {
  Box,
  Card,
  Typography,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
  Tooltip,
  Skeleton,
  Zoom
} from '@mui/material';
// components
import { useDispatch } from 'src/redux/store';
import { setWishlist } from 'src/redux/slices/wishlist';
import { addCompareProduct, removeCompareProduct } from '../../redux/slices/compare';
import ColorPreviewGroup from 'src/components/colorPreviewGroup';

import Label from 'src/components/label';
import BlurImage from 'src/components/blurImage';
// hooks
import { useCurrencyConvert } from 'src/hooks/convertCurrency';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
// api
import * as api from 'src/services';
// icons
import { IoMdHeartEmpty } from 'react-icons/io';
import { GoEye } from 'react-icons/go';
import { GoGitCompare } from 'react-icons/go';
import { IoIosHeart } from 'react-icons/io';
import { FaRegStar } from 'react-icons/fa';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

// dynamic
const ProductDetailsDialog = dynamic(() => import('../dialog/productDetails'));

// Helper function to check if URL is a video
function isVideo(url) {
  return /\.(mp4|webm|ogg|mov)$/i.test(url);
}

export default function ShopProductCard({ product = {}, loading = false, ...props }) {
  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormatter();

  const [open, setOpen] = useState(false);
  const [openActions, setOpenActions] = useState(false);
  const theme = useTheme();
  const router = useRouter();
  
  // Check if Redux is available
  const reduxContext = useContext(ReactReduxContext);
  const dispatch = reduxContext ? useDispatch() : null;

  const videoRef = useRef(null);
  
  // Only use Redux selectors if context exists
  const wishlist = reduxContext ? useSelector(({ wishlist }) => wishlist.wishlist) : [];
  const compareProducts = reduxContext ? useSelector(({ compare }) => compare.products) : [];
  const isAuthenticated = reduxContext ? useSelector(({ user }) => user.isAuthenticated) : false;
  
  const isTablet = useMediaQuery('(max-width:900px)');
  const [isLoading, setLoading] = useState(false);

  // Only use mutations if Redux is available (not on public routes)
  const { mutate } = reduxContext ? useMutation(api.updateWishlist, {
    onSuccess: (data) => {
      toast.success(data.message);
      setLoading(false);
      if (dispatch) dispatch(setWishlist(data.data));
    },
    onError: (err) => {
      setLoading(false);
      const message = JSON.stringify(err.response.data.message);
      toast.error(message ? JSON.parse(message) : 'Something went wrong');
    }
  }) : { mutate: () => {} }; // Provide dummy mutate function for public routes

  const { name, slug, image, _id, averageRating, priceSale, dateCaptured, location } = !loading && product;

  const slugify = (text) => {
    if (!text) return 'race-track';
    return text
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start
      .replace(/-+$/, ''); // Trim - from end
  };

  // Format date to YYYY-MM-DD
  const formatDate = (dateStr) => {
    if (!dateStr) return '2025';
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  //event/:brand/:date/pictures/:slug
  const locationSlug = slugify(location);
  const dateSlug = formatDate(dateCaptured);
  const linkTo = `/event/${locationSlug ? locationSlug : ''}/${dateSlug ? dateSlug : ''}/pictures/${slug ? slug : ''}`;
  //const linkTo = `/product/${slug ? slug : ''}`;

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
  const onAddCompare = async (event) => {
    event.stopPropagation();
    if (!dispatch) return;
    toast.success('Added to compare list');
    dispatch(addCompareProduct(product));
  };

  const onRemoveCompare = async (event) => {
    event.stopPropagation();
    if (!dispatch) return;
    toast.success('Removed from compare list');
    dispatch(removeCompareProduct(_id));
  };

  // Handlers for video play/pause on hover
  const handleMediaMouseEnter = () => {
    setOpenActions(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMediaMouseLeave = () => {
    setOpenActions(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Card
      onMouseEnter={() => !isLoading && setOpenActions(true)}
      onMouseLeave={() => setOpenActions(false)}
      sx={{
        marginBottom: '10px',
        display: 'block',
        boxShadow:
          theme.palette.mode === 'light' ? '0 6px 16px rgba(145, 158, 171, 25%)' : '0 6px 16px rgb(5 6 6 / 25%)'
      }}
    >
      <Box
        {...(product?.available >= 0 && {
          component: Link,
          href: linkTo
        })}
        sx={{
          bgcolor: isLoading || loading ? 'transparent' : 'common.white',
          position: 'relative',
          cursor: 'pointer',
          height: '170px',
          '&:after': {
            content: `""`,
            display: 'block',
            paddingBottom: '100%'
          },
          width: '100%'
        }}
        onMouseEnter={isVideo(image?.url) ? handleMediaMouseEnter : undefined}
        onMouseLeave={isVideo(image?.url) ? handleMediaMouseLeave : undefined}
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
        ) : isVideo(image?.url) ? (
          <Box component={Link} href={linkTo}>
            <video
              ref={videoRef}
              src={image.url}
              preload="metadata" // or "auto" to preload more data if needed
              muted
              loop
              playsInline
              //poster={image?.blurDataURL || ''} // placeholder image
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
                display: 'block' // Make sure video is visible
              }}
            />
          </Box>
        ) : (
          <Box component={Link} href={linkTo}>
            <BlurImage
              alt={name || 'Product image'}
              src={image.url}
              fill
              draggable="false"
              objectFit="cover"
              placeholder="blur"
              blurDataURL={image?.blurDataURL}
            />
          </Box>
        )}
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            sx={{
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
            {...(product?.available > 0 && {
              component: Link,
              href: linkTo
            })}
            variant="subtitle1"
            noWrap
          >
            {loading ? <Skeleton variant="text" width={120} /> : name}
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {loading ? <Skeleton variant="text" width={60} /> : `${fCurrency(cCurrency(product?.priceSale))}`}
          </Typography>
        </Box>

        {/* If you want to uncomment this block, uncomment in original code */}
        {/* <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
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
                <FaRegStar /> ({averageRating?.toFixed(1) || 0})
              </>
            )}
          </Typography>
        </Stack> */}
      </Stack>

      {/* Only show dialog on routes with QueryClient (user routes) */}
      {reduxContext && <ProductDetailsDialog product={product} open={open} onClose={() => setOpen(false)} />}
    </Card>
  );
}

ShopProductCard.propTypes = {
  product: PropTypes.object,
  loading: PropTypes.bool
};


