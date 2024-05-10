'use client';
import PropTypes from 'prop-types';
// next
import Link from 'next/link';
// mui
import { Typography, CardActionArea, Card, Box, Skeleton, Stack, Rating, Button, useTheme } from '@mui/material';
// components
import Image from 'src/components/blurImage';
// icons
import { AiOutlineShop } from 'react-icons/ai';
import { FaRegUser } from 'react-icons/fa6';

export default function ShopCard({ ...props }) {
  const { shop, isLoading } = props;
  const baseUrl = '/shops/';
  const theme = useTheme();

  return (
    <Card
      sx={{
        px: 3,
        py: 2,
        borderRadius: 2
      }}
    >
      <Stack direction="row" alignItems="center" spacing={3}>
        {isLoading ? (
          <Skeleton
            variant="circular"
            sx={{
              height: 90,
              width: 90
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'relative',
              border: '1px soild #eee',
              height: 90,
              width: 90,
              minWidth: 90,
              img: {
                borderRadius: '50%'
              },
              '&:after': {
                content: `""`,
                display: 'block',
                paddingBottom: '100%'
              }
            }}
          >
            <Image
              alt="shop"
              src={shop?.logo?.url}
              placeholder="blur"
              blurDataURL={shop?.logo?.blurDataURL}
              layout="fill"
              objectFit="cover"
              static
              draggable="false"
              quality={5}
              sizes={'50vw'}
            />
          </Box>
        )}
        <Box>
          <Typography
            {...(!isLoading && {
              component: Link,
              href: baseUrl + shop?.slug
            })}
            color="text.primary"
            variant="h6"
            textAlign="center"
            noWrap
            className="title"
            sx={{ textTransform: 'capitalize' }}
          >
            {isLoading ? <Skeleton variant="text" width={100} /> : shop?.title}
          </Typography>
          <Stack direction="row" justifyContent="space-between" width="100%">
            <Typography color="text.secondary" variant="body1" textAlign="center" noWrap className="title">
              3 Product
            </Typography>
            <div>
              <Rating
                name="size-small"
                defaultValue={5}
                readOnly
                sx={{
                  fontSize: 20
                }}
              />
            </div>
          </Stack>
          <Stack direction="row" justifyContent="space-between" spacing={3} mt={1}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AiOutlineShop />}
              sx={{
                borderRadius: 6,
                fontWeight: 400
              }}
            >
              View Store
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FaRegUser style={{ fontSize: 16 }} />}
              sx={{
                borderRadius: 6,
                fontWeight: 400
              }}
            >
              Follow
            </Button>
          </Stack>
        </Box>
      </Stack>
      {/* <CardActionArea className="card-action-area" component={Link} href={`${baseUrl + shop?.slug}`}>
        <CardContent></CardContent>
      </CardActionArea> */}
    </Card>
  );
}
ShopCard.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  shop: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    cover: PropTypes.shape({
      url: PropTypes.string.isRequired,
      blurDataURL: PropTypes.string.isRequired
    }),
    logo: PropTypes.shape({
      url: PropTypes.string.isRequired,
      blurDataURL: PropTypes.string.isRequired
    }),

    title: PropTypes.string.isRequired,
    address: PropTypes.object.isRequired
  }).isRequired
};
