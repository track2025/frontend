'use client';
// react
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// next
import Image from 'next/image';
import Link from 'next/link';
// mui
import {
  Box,
  Grid,
  Paper,
  Button,
  Typography,
  CardContent,
  Container,
  useMediaQuery,
  Stack,
  alpha
} from '@mui/material';
// redux
import { useSelector } from 'react-redux';
// framer motion
import { motion, AnimatePresence } from 'framer-motion';
import { varFadeInRight, MotionContainer } from 'src/components/animate';
// components
import Actions from './actions';

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
CarouselItem.propTypes = {
  item: PropTypes.shape({
    cover: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    btnPrimary: PropTypes.shape({
      url: PropTypes.string.isRequired,
      btnText: PropTypes.string.isRequired
    }).isRequired,
    btnSecondary: PropTypes.shape({
      url: PropTypes.string.isRequired,
      btnText: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  index: PropTypes.number.isRequired,
  themeMode: PropTypes.string.isRequired
};

function CarouselItem({ ...props }) {
  const { item, index, themeMode } = props;
  const isMobile = useMediaQuery('@media (max-width: 992px)');
  const [first, setfirst] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setfirst(true);
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <Paper
      sx={{
        bgcolor: alpha(item.color, themeMode === 'dark' ? 0.2 : 0.4),
        position: 'relative',
        borderBottom: (theme) => '1px solid ' + theme.palette.divider,
        zIndex: 11,
        borderRadius: 0,
        img: {
          borderRadius: 0,
          objectPosition: { md: 'center', xs: 'left' }
        }
      }}
    >
      <Box
        sx={{
          top: 0,
          width: '100%',
          height: '100%',
          position: 'absolute',
          background: (theme) => (theme.palette.mode === 'dark' ? alpha(theme.palette.grey[800], 0.2) : '')
        }}
      />
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid
            item
            xs={6}
            sm={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            {/* <CardContent
              sx={{
                top: { xl: '22%', lg: '23.5%', md: '28%', xs: '55%' },
                left: 0,
                transform: 'translateY(-50%)',
                width: '100%',
                textAlign: 'left',
                position: 'absolute',
                color: 'common.white'
              }}
            > */}
            <MotionContainer open={first}>
              <motion.div variants={varFadeInRight}>
                <Typography
                  variant="h2"
                  color="text.primary"
                  component="h1"
                  lineHeight={1.1}
                  gutterBottom
                  fontWeight="900!important"
                  sx={{
                    pointerEvents: 'none'
                  }}
                >
                  {item?.heading}
                </Typography>
              </motion.div>
              <motion.div variants={varFadeInRight}>
                <Typography
                  variant="h6"
                  gutterBottom
                  color={'text.secondary'}
                  sx={{
                    fontWeight: 400,
                    pointerEvents: 'none',
                    marginTop: 1
                  }}
                >
                  {item?.description}
                </Typography>
              </motion.div>
              <motion.div variants={varFadeInRight}>
                <div>
                  <Button
                    size={isMobile ? 'small' : 'large'}
                    variant="contained"
                    component={Link}
                    href={item?.btnPrimary.url}
                    sx={{ mt: 1 }}
                  >
                    {item?.btnPrimary.btnText || 'Shop Now'}
                  </Button>

                  <Button
                    size={isMobile ? 'small' : 'large'}
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 1, mx: { sm: 2, xs: 1 } }}
                    component={Link}
                    href={item?.btnSecondary.url}
                  >
                    {item?.btnSecondary.btnText || 'See All'}
                  </Button>
                </div>
              </motion.div>
            </MotionContainer>
            {/* </CardContent> */}
          </Grid>
          <Grid item xs={6} sm={6}>
            <Box className="img-box">
              <Image
                priority
                src={item.cover}
                alt="centered-banner"
                layout="fill"
                objectFit="contain"
                static
                draggable="false"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
}

export default function SingleSlideCarousel({ ...props }) {
  const { data } = props;
  const { themeMode } = useSelector(({ settings }) => settings);
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = Math.abs(page % data?.length);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };
  useEffect(() => {
    setTimeout(() => {
      setPage([page + 1, 1]);
    }, 12000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isEmpty = !Boolean(data?.length);

  return (
    <Paper
      sx={{
        width: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        height: 350,
        borderRadius: '8px',
        overflow: 'hidden',
        borderBottom: (theme) => '1px solid ' + theme.palette.divider,
        boxShadow: 'none'
      }}
    >
      {isEmpty ? (
        <Stack
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Typography variant="h4" color="text.secondary">
            Slides are not uploaded yet!
          </Typography>
        </Stack>
      ) : (
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              top: 0
            }}
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
            <CarouselItem
              themeMode={themeMode}
              item={data ? data[imageIndex] : null}
              index={data ? data[imageIndex] : null}
              activeStep={imageIndex}
              isActive={imageIndex}
              key={Math.random()}
            />
          </motion.div>
        </AnimatePresence>
      )}
      {data.length && (
        <Actions active={imageIndex} themeMode={themeMode} setPage={setPage} paginate={paginate} data={data} />
      )}
    </Paper>
  );
}
SingleSlideCarousel.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      cover: PropTypes.string.isRequired,
      heading: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      btnPrimary: PropTypes.shape({
        url: PropTypes.string.isRequired,
        btnText: PropTypes.string.isRequired
      }).isRequired,
      btnSecondary: PropTypes.shape({
        url: PropTypes.string.isRequired,
        btnText: PropTypes.string.isRequired
      }).isRequired
    })
  ).isRequired
};
