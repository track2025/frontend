'use client';
import React, { useState } from 'react';

import NextLink from 'next/link';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { useRouter } from 'next/router';
// mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  Container,
  Card,
  Skeleton,
  Stack,
  alpha,
  IconButton,
  Dialog,
  DialogContent,
  Button
} from '@mui/material';
// components
import MyAvatar from 'src/components/myAvatar';
// icons
import { IoIosArrowForward } from 'react-icons/io';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import QRCode from 'react-qr-code';
import BlurImage from 'src/components/blurImage';

const RootStyle = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  height: 300,
  position: 'relative',
  overflow: 'hidden',
  borderWidth: 0,
  borderBottomWidth: 1
  // [theme.breakpoints.down('md')]: {
  //   display: 'none'
  // }
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
      // Get the QR code SVG element
      const qrSvg = document.getElementById('qr-code-svg');

      if (!qrSvg) {
        throw new Error('QR code not found');
      }

      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(qrSvg);
      const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));

      // Create a new window for printing
      const printWindow = window.open('', '_blank');

      printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${data?.title || data?.name || 'Business Card'}</title>
          <style>
            body { 
              margin: 0; 
              padding: 40px; 
              font-family: Arial, sans-serif; 
              background: white;
              display: flex;
              flex-direction: column;
              align-items: center;
              min-height: 100vh;
            }
            @media print {
              body { 
                margin: 0; 
                padding: 20px; 
              }
            }
            .print-container { 
              text-align: center; 
              max-width: 100%; 
            }
            .title {
              margin: 0 0 30px 0; 
              color: #333;
              font-size: 24px;
              font-weight: bold;
            }
            .business-cards { 
              display: flex; 
              flex-direction: column; 
              align-items: center; 
              gap: 20px; 
              margin: 20px 0; 
            }
            .business-card { 
              width: 350px; 
              height: 200px; 
              border: 1px solid #e0e0e0; 
              border-radius: 8px; 
              box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
              overflow: hidden;
              position: relative;
            }
            .business-card img { 
              width: 100%; 
              height: 100%; 
              object-fit: cover; 
            }
            .qr-overlay {
              position: absolute;
              top: 50%;
              right: 16px;
              transform: translateY(-50%);
              background: white;
              padding: 8px;
              border-radius: 4px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              border: 1px solid #e0e0e0;
            }
            .qr-overlay img {
              width: 130px;
              height: 130px;
              object-fit: contain;
            }
            .timestamp {
              margin-top: 30px;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <h1 class="title">${data?.title || data?.name || 'Business Card'}</h1>
            <div class="business-cards">
              <!-- Business Card Front -->
              <div class="business-card">
                <img src="${window.location.origin}/images/business_front.jpg" alt="Business Card Front" 
                     onerror="this.style.display='none'; this.parentElement.innerHTML += '<div style=\\'position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);\\'>Front Card Image</div>'" />
              </div>
              
              <!-- Business Card Back with QR Code -->
              <div class="business-card">
                <img src="${window.location.origin}/images/business_back.jpg" alt="Business Card Back" 
                     onerror="this.style.display='none'; this.parentElement.innerHTML += '<div style=\\'position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);\\'>Back Card Image</div>'" />
                <div class="qr-overlay">
                  <img src="${svgDataUrl}" alt="QR Code" />
                </div>
              </div>
            </div>
            <p class="timestamp">Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <script>
            // Wait for images to load before printing
            window.onload = function() {
              const images = document.querySelectorAll('img');
              let loadedCount = 0;
              const totalImages = images.length;
              
              if (totalImages === 0) {
                setTimeout(printNow, 500);
                return;
              }
              
              images.forEach(img => {
                if (img.complete) {
                  loadedCount++;
                } else {
                  img.onload = () => {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                      setTimeout(printNow, 500);
                    }
                  };
                  img.onerror = () => {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                      setTimeout(printNow, 500);
                    }
                  };
                }
              });
              
              // Fallback in case some images don't load
              setTimeout(printNow, 3000);
            };
            
            function printNow() {
              window.print();
              // Close window after printing (optional)
              // window.afterprint = function() {
              //   setTimeout(() => window.close(), 1000);
              // };
            }
          </script>
        </body>
      </html>
    `);

      printWindow.document.close();

    } catch (error) {
      console.error('Error printing:', error);
      alert('Failed to print. Please try again.');
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
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="end"
                  spacing={0.5}
                  sx={{ display: { xs: 'none', md: 'block' } }}
                >
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
      <Dialog open={openQR} onClose={() => setOpenQR(false)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h6" gutterBottom>
            {data?.title || data?.name}
          </Typography>

          {/* Container for stacked business cards */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            justifyContent: 'center',
            mb: 2,
            alignItems: 'center',
            position: 'relative' // For absolute positioning of QR code
          }}>
            {/* Business Card Front */}
            <Box sx={{
              p: 1,
              bgcolor: 'white',
              width: 350, // Increased from 280
              height: 200,// Increased from 160
              border: '1px solid #e0e0e0',
              borderRadius: '8px', // Increased border radius
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)', // Enhanced shadow
              position: 'relative',
              zIndex: 1
            }}>
              <BlurImage
                src="/images/business_front.jpg"
                alt="Business Card Front"
                fill
                style={{
                  objectFit: 'cover',
                  borderRadius: '6px'
                }}
              />
            </Box>

            {/* Business Card Back with QR Code */}
            <Box sx={{
              p: 1,
              bgcolor: 'white',
              width: 350, // Increased from 280
              height: 200, // Increased from 160
              border: '1px solid #e0e0e0',
              borderRadius: '8px', // Increased border radius
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)', // Enhanced shadow
              position: 'relative',
            }}>
              <BlurImage
                src="/images/business_back.jpg"
                alt="Business Card Back"
                fill
                style={{
                  objectFit: 'cover',
                  borderRadius: '6px'
                }}
              />

              {/* QR Code positioned absolutely on top of back card */}
              <Box sx={{
                position: 'absolute',
                top: '50%',
                right: 16, // Position from right edge
                transform: 'translateY(-50%)',
                bgcolor: 'white',
                p: 1,
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                border: '1px solid #e0e0e0'
              }}>
                <QRCode
                  id="qr-code-svg"
                  value={qrValue}
                  size={130} // Smaller size for card placement
                  level="H"
                  style={{
                    height: 'auto',
                    maxWidth: '100%',
                    width: '100%',
                    display: 'block'
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Download Button */}
          <Button variant="contained" onClick={handleDownloadQR} fullWidth>
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
    description: PropTypes.string
  }),
  isLoading: PropTypes.bool.isRequired,
  isUser: PropTypes.bool,
  page: PropTypes.string
};
