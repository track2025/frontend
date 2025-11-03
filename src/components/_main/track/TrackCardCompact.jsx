// components/_main/track/TrackCardCompact.jsx
'use client';
import React from 'react';
import Link from 'next/link';
import { Typography, Card, Stack, CardActionArea, Skeleton, Box } from '@mui/material';
import Image from 'src/components/blurImage';

export function TrackCardCompact({ track, onClick }) {
  // Safely get the photo count, default to 0 if undefined
  const photoCount = track.totalProducts || 0;
  const photoText = photoCount === 1 ? 'Photo' : 'Photos';

  // If onClick is provided, use the existing logic
  if (onClick) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Card
          className="slider-main"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '10px',
            position: 'relative',
            mb: 3,
            width: '100%',
            maxWidth: 400,
            img: {
              borderRadius: '8px',
              objectFit: 'contain'
            }
          }}
        >
          <CardActionArea onClick={() => onClick(track.slug)} sx={{ p: 1, pr: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Image
                src={track.logo?.url || '/default-track-image.jpg'}
                alt={track.name}
                width={70}
                height={70}
                draggable="false"
                placeholder="blur"
                objectFit="cover"
                blurDataURL={track?.logo?.blurDataURL}
              />
              <Stack sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="subtitle1" color="text.primary" noWrap>
                  {track.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {track.city && track.country ? `${track.city}, ${track.country}` : 'Location not specified'}
                </Typography>
                <Typography variant="body2" noWrap>
                  {`${photoCount} ${photoText}`}
                </Typography>
              </Stack>
            </Stack>
          </CardActionArea>
        </Card>
      </Box>
    );
  }

  // Use Link for better performance when no custom onClick
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Card
        className="slider-main"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px',
          position: 'relative',
          mb: 3,
          width: '100%',
          maxWidth: 400,
          img: {
            borderRadius: '8px',
            objectFit: 'contain'
          }
        }}
      >
        <CardActionArea component={Link} href={`/tracks/${track.slug}?date=-1`} sx={{ p: 1, pr: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Image
              src={track.logo?.url || '/default-track-image.jpg'}
              alt={track.name}
              width={70}
              height={70}
              draggable="false"
              placeholder="blur"
              objectFit="cover"
              blurDataURL={track?.logo?.blurDataURL}
            />
            <Stack sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="subtitle1" color="text.primary" noWrap>
                {track.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {track.city && track.country ? `${track.city}, ${track.country}` : 'Location not specified'}
              </Typography>
              <Typography variant="body2" noWrap>
                {`${photoCount} ${photoText}`}
              </Typography>
            </Stack>
          </Stack>
        </CardActionArea>
      </Card>
    </Box>
  );
}

export function TrackCardCompactSkeleton({ index = 0 }) {
  // Create varying widths to simulate the masonry effect of actual track cards
  // This creates a pattern of different widths that repeats
  const widthVariants = [300, 260, 300, 200, 360, 270, 380, 240];
  const width = widthVariants[index % widthVariants.length];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Card
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: '10px',
          mb: 3,
          width: width,
          height: 90
        }}
      >
        <Box sx={{ p: 1, pr: 2, width: '100%' }}>
          <Skeleton variant="rounded" width="100%" height={70} sx={{ borderRadius: '8px' }} />
        </Box>
      </Card>
    </Box>
  );
}
