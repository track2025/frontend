'use client';
import PropTypes from 'prop-types';
// next
import Link from 'next/link';
// mui
import { Typography, CardActionArea, Card, Box, Skeleton, Stack, CardContent } from '@mui/material';
// components
import Image from 'src/components/blurImage';
// icons
import { IoLocationOutline } from 'react-icons/io5';

export default function ShopCard({ ...props }) {
  const { shop, isLoading } = props;
  const baseUrl = '/shops/';

  return (
    <Card>
      <CardActionArea className="card-action-area" component={Link} href={`${baseUrl + shop?.slug}`}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={3}>
            {isLoading ? (
              <Skeleton
                variant="circular"
                sx={{
                  height: 72,
                  width: 72
                }}
              />
            ) : (
              <Box
                sx={{
                  position: 'relative',
                  height: 72,
                  width: 72,
                  minWidth: 72,
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
              <Typography
                color="text.secondary"
                variant="body2"
                textAlign="center"
                noWrap
                className="title"
                sx={{ textTransform: 'capitalize', display: 'flex', alignItems: 'center' }}
              >
                {isLoading ? (
                  <Skeleton variant="text" width={100} />
                ) : (
                  <>
                    <IoLocationOutline />{' '}
                    {shop?.address.streetAddress + ', ' + shop?.address.city + ', ' + shop?.address.country}
                  </>
                )}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
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
    name: PropTypes.string.isRequired
  }).isRequired
};
