// components/_main/track/TrackCardCompact.jsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Card, Stack, CardActionArea, Skeleton, Box } from '@mui/material';
import Image from 'src/components/blurImage';

export function TrackCardCompact({ track, onClick }) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick(track.slug);
    } else {
      router.push(`/tracks/${track.slug}`);
    }
  };

  // Safely get the photo count, default to 0 if undefined
  const photoCount = track.totalProducts || 0;
  const photoText = photoCount === 1 ? 'Photo' : 'Photos';

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
        <CardActionArea onClick={handleClick} sx={{ p: 1, pr: 2 }}>
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
              <Typography variant="body1" noWrap>
                {`${photoCount} ${photoText}`}
              </Typography>
            </Stack>
          </Stack>
        </CardActionArea>
      </Card>
    </Box>
  );
}

export function TrackCardCompactSkeleton() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Card
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px',
          position: 'relative',
          mb: 3,
          width: '100%',
          maxWidth: 400,
          height: 100
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 1, pr: 2, width: '100%' }}>
          <Skeleton variant="rounded" width={70} height={70} />
          <Stack sx={{ flex: 1 }}>
            <Skeleton variant="text" width="80%" height={24} />
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="40%" height={20} />
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}
