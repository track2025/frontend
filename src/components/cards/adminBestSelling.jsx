import React from 'react';
import NextLink from 'next/link';
import PropTypes from 'prop-types';

// mui
import { Card, CardContent, CardHeader, Divider, Box, Stack, Typography, Skeleton } from '@mui/material';
import BlurImage from 'src/components/blurImage';
// components
import ColorPreviewGroup from '../colorPreviewGroup';
import NoDataFoundIllustration from 'src/illustrations/dataNotFound';
import { CardMedia, Chip } from '@mui/material';

AdminBestSelling.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  isVendor: PropTypes.bool
};

export default function AdminBestSelling({ ...props }) {
  const { data, loading, isVendor } = props;

  console.log('data:::::::::', data)

  return (
    <>
      <Card sx={{ height: '100%' }}>
        <CardHeader title={'Best Selling Photographers'} />
        {data?.length < 1 ? (
          <NoDataFoundIllustration
            sx={{
              height: 300,
              width: 300
            }}
          />
        ) : (
          <CardContent>
            {(loading ? Array.from(new Array(5)) : data)?.map((value, index, array) => (
              <React.Fragment key={index}>
                  {/* <Stack direction="row" alignItems="center" spacing={2}>
                    {loading ? (
                      <Skeleton variant="rounded" width={64} height={64} />
                    ) : (
                      <Box
                        sx={{
                          position: 'relative',
                          height: 64,
                          width: 64,
                          borderRadius: '8px',
                          border: '1px solid rgba(145, 158, 171, 0.32)',
                          img: {
                            borderRadius: '8px'
                            // border: "1px solid rgba(145, 158, 171, 0.32)",
                          }
                        }}
                      >
                        <BlurImage priority src={value.images[0].url} alt="product" layout="fill" objectFit="cover" />
                      </Box>
                    )}
                    <Box>
                      <Typography
                        component={NextLink}
                        href={
                          loading
                            ? '/admin/products'
                            : isVendor
                              ? `/vendor/products/${value?.slug}`
                              : `/admin/products/${value?.slug}`
                        }
                        variant="subtitle1"
                        noWrap
                        color="text.primary"
                      >
                        {loading ? <Skeleton variant="text" width={160} /> : value?.name?.slice(0, 18)}
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="text.secondary">
                        {loading ? <Skeleton variant="text" width={60} /> : <> {value?.sold} sold</>}
                      </Typography>
                    </Box>
                  </Stack> */}

                  <Card
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 2,
                      mb: 2
                    }}
                  >
                    {/* Left: Thumbnail */}
                    <Box
                      component="img"
                      src={value?.logo?.url}
                      alt={value?.username}
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 2,
                        objectFit: 'cover',
                        mr: 2
                      }}
                    />

                    {/* Right: Details */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {value?.paymentInfo?.holderName || value?.username}
                      </Typography>

                      {/* <Stack direction="row" spacing={1} sx={{ my: 1 }}>
                        <Chip label={value?.vehicle_make} size="small" />
                        <Chip label={value?.vehicle_model} size="small" />
                      </Stack> */}

                      <Typography variant="body2" color="text.secondary">
                        <strong>Location:</strong> {value?.address?.streetAddress}
                      </Typography>

                      {/* <Typography variant="body2" color="text.secondary">
                        <strong>Date:</strong> {new Date(value?.dateCaptured).toLocaleDateString()}
                      </Typography> */}

                      {/* <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                        {value?.currency} {value?.priceSale}
                      </Typography> */}
                    </Box>
                  </Card>

                  {loading ? (
                    <Skeleton variant="text" width={72} />
                  ) : (
                    <ColorPreviewGroup limit={3} colors={value?.colors} sx={{ minWidth: 72 }} />
                  )}
                {index !== array.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </CardContent>
        )}
      </Card>
    </>
  );
}
