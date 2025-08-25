'use client';
import React, {useState} from 'react';

import NextLink from 'next/link';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { useRouter } from 'next/router';
// mui
import { styled } from '@mui/material/styles';
import { Box, Typography, Container, Card, Skeleton, Stack, alpha, IconButton, Dialog, DialogContent, Button } from '@mui/material';
// components
import MyAvatar from 'src/components/myAvatar';
// icons
import { IoIosArrowForward } from 'react-icons/io';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import QRCode from 'react-qr-code';

const RootStyle = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  height: 300,
  position: 'relative',
  overflow: 'hidden',
  borderWidth: 0,
  borderBottomWidth: 1,
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));

const InfoStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: 'absolute',
  bottom: '35px !important',
  [theme.breakpoints.up('md')]: {
    right: 'auto',
    display: 'flex',
    alignItems: 'center',
    left: theme.spacing(3),
    bottom: theme.spacing(3)
  }
}));

const CoverImgStyle = styled('div')({
  zIndex: 8,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

export default function ShopDetailCover({ data, isLoading, isUser, page }) {
  const [openQR, setOpenQR] = useState(false);
  const [qrValue, setQrValue] = useState('');

  const handleOpenQR = () => {
  // Get the current base URL from the browser
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  // Combine with your path
  const fullUrl = `${baseUrl}/photographers/${data?.slug}`;
  
  setQrValue(fullUrl);
  setOpenQR(true);
};

const handleDownloadQR = () => {
    try {
      const svg = document.getElementById('qr-code-svg');
      if (!svg) {
        throw new Error('QR code SVG not found');
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 300;
      canvas.height = 300;

      // Use document.createElement instead of new Image()
      const img = document.createElement('img');
      img.onload = () => {
        // Draw white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw the QR code
        ctx.drawImage(img, 50, 50, 200, 200);
        
        // Convert to PNG and trigger download
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `${data?.title || data?.name || 'photographer'}-qr-code.png`;
        downloadLink.href = pngUrl;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };
      
      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svg);
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Failed to download QR code. Please try again.');
    }
  };

  
  return (
    <RootStyle>
      {!isLoading && (
        <>
          <Image
            src={data?.cover?.url}
            alt={data?.title || data?.name}
            placeholder="blur"
            blurDataURL={data?.cover?.blurDataURL}
            objectFit="cover"
            fill
          />
          <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
            <IconButton 
              onClick={handleOpenQR}
              sx={{ 
                backgroundColor: alpha('#fff', 0.8),
                '&:hover': {
                  backgroundColor: '#fff'
                }
              }}
            >
              <QrCode2Icon />
            </IconButton>
          </Box>
        </>
      )}

      <div>
        <Container maxWidth="xl">
          <InfoStyle>
            {data?.logo ? (
              <MyAvatar
                data={{ cover: data?.logo?.url, fullName: data?.title }}
                sx={{
                  mx: 'auto',
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderColor: 'common.white',
                  width: { xs: 80, md: 128 },
                  height: { xs: 80, md: 128 },
                  boxShadow: (theme) => `inset -1px 1px 2px ${alpha(theme.palette.common.black, 0.24)}`
                }}
              />
            ) : null}

            <Box
              sx={{
                ml: { md: 3 },
                mt: { xs: 1, md: 0 },
                color: 'common.white',
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              <Typography variant="h4">
                {isLoading ? <Skeleton variant="text" width={220} /> : data?.title || data?.name}
              </Typography>
              {isUser ? (
                <Stack direction="row" alignItems="center" justifyContent="end" spacing={0.5}>
                  <Typography variant="body1" component={NextLink} href="/" color="common.white">
                    Home
                  </Typography>
                  <IoIosArrowForward size={12} />
                  <Typography
                    variant="body1"
                    component={NextLink}
                    href={'/photographers'}
                    color="common.white"
                    sx={{
                      textTransform: 'capitalize'
                    }}
                  >
                    Photographers
                  </Typography>
                  <IoIosArrowForward size={12} />
                  <Typography variant="body1">{data?.title || data?.name}</Typography>
                </Stack>
              ) : (
                <Typography variant="body1">
                  {isLoading ? <Skeleton variant="text" width={220} /> : data?.description}
                </Typography>
              )}
            </Box>
          </InfoStyle>
          <CoverImgStyle />
        </Container>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={openQR} onClose={() => setOpenQR(false)}>
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h6" gutterBottom>
            {data?.title || data?.name}
          </Typography>
          <Box sx={{ p: 2, bgcolor: 'white', display: 'inline-block', mb: 2 }}>
            <QRCode 
  id="qr-code-svg"
  value={qrValue} 
  size={200} 
  level="H"
  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
/>
          </Box>
          <Button 
            variant="contained" 
            onClick={handleDownloadQR}
            fullWidth
          >
            Download QR Code 
          </Button>
        </DialogContent>
      </Dialog>
    </RootStyle>
  );
}

ShopDetailCover.propTypes = {
  data: PropTypes.shape({
    cover: PropTypes.shape({
      url: PropTypes.string.isRequired,
      blurDataURL: PropTypes.string
    }),
    logo: PropTypes.shape({
      url: PropTypes.string.isRequired
    }),
    title: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
  }),
  isLoading: PropTypes.bool.isRequired,
  isUser: PropTypes.bool,
  page: PropTypes.string
};