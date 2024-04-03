// react
'use client';
import PropTypes from 'prop-types';
import { useState } from 'react';
// next
import BlurImage from 'src/components/blurImage';
import { toast } from 'react-hot-toast';
// mui
import { Box, Stack, IconButton, useMediaQuery, Tooltip } from '@mui/material';
import { IoMdHeartEmpty } from 'react-icons/io';
import { IoIosHeart } from 'react-icons/io';
// redux
import { setWishlist } from 'src/lib/redux/slices/wishlist';
import { useSelector, useDispatch } from 'react-redux';
// api
import * as api from 'src/services';
import { useMutation } from 'react-query';
// framer motion
import { motion, AnimatePresence } from 'framer-motion';

// styles override
import RootStyled from './styled';

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    };
  }
};

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

// ----------------------------------------------------------------------
ProductDetailsCarousel.propTypes = {
  item: PropTypes.object.isRequired,
  onClickWishList: PropTypes.func.isRequired,
  wishlist: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  _id: PropTypes.string.isRequired
};

function ProductDetailsCarousel({ ...props }) {
  const { item, onClickWishList, wishlist, isLoading, isMobile, _id } = props;

  return (
    <div className="slide-wrapper">
      <Stack
        sx={{
          bgcolor: 'background.paper',
          position: 'absolute',
          top: isMobile ? 7 : 12,
          right: isMobile ? 5 : 14,
          borderRadius: '50%',
          width: 30,
          height: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          img: {
            borderRadius: '50%'
          }
        }}
      >
        {wishlist?.filter((v) => v === _id).length > 0 ? (
          <Tooltip title="Remove from cart">
            <IconButton
              disabled={isLoading}
              onClick={onClickWishList}
              aria-label="add to cart"
              color="primary"
              size={isMobile ? 'small' : 'medium'}
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
              size={isMobile ? 'small' : 'medium'}
            >
              <IoMdHeartEmpty />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
      {item && (
        <BlurImage
          priority
          fill
          objectFit="cover"
          sizes="50%"
          src={item?.url || item?.src}
          alt="hero-carousel"
          placeholder="blur"
          blurDataURL={item.blurDataURL}
        />
      )}
      <Box className="bg-overlay" />
    </div>
  );
}

export default function CarouselAnimation({ ...props }) {
  const { product, data: others } = props;

  const dispatch = useDispatch();
  const _id = others?._id;

  const images = product?.images;
  const { wishlist } = useSelector(({ wishlist }) => wishlist);
  const { isAuthenticated } = useSelector(({ user }) => user);
  const [isLoading, setLoading] = useState(false);
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
      await mutate(_id);
    }
  };
  const isMobile = useMediaQuery('(max-width:600px)');
  const { themeMode } = useSelector(({ settings }) => settings);
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = Math.abs(page % images?.length);
  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <RootStyled>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          className="motion-dev"
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        >
          <ProductDetailsCarousel
            themeMode={themeMode}
            item={images[imageIndex]}
            index={images[imageIndex]}
            activeStep={imageIndex}
            isActive={imageIndex}
            key={Math.random()}
            isLoading={isLoading}
            wishlist={wishlist}
            onClickWishList={onClickWishList}
            isMobile={isMobile}
            _id={_id}
          />
        </motion.div>
      </AnimatePresence>
      <Stack
        direction="row"
        justifyContent={images.length < 6 ? 'center' : 'left'}
        spacing={1}
        className="controls-wrapper"
      >
        {images.map((item, i) => (
          <Box
            key={Math.random()}
            className={`controls-button ${imageIndex === i ? 'active' : ''}`}
            onClick={() => {
              setPage([i, i]);
            }}
          >
            <BlurImage
              priority
              fill
              objectFit="cover"
              sizes="14vw"
              src={item?.src || item?.url}
              alt="hero-carousel"
              placeholder="blur"
              blurDataURL={item.blurDataURL}
            />
          </Box>
        ))}
      </Stack>
    </RootStyled>
  );
}
CarouselAnimation.propTypes = {
  product: PropTypes.object,
  data: PropTypes.object
};
