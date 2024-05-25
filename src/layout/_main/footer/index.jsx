'use client';
// react
import React from 'react';

// mui
import { alpha, useTheme } from '@mui/material/styles';
import { Typography, Container, Stack, Box, IconButton, Grid, Link, Fab, Divider } from '@mui/material';
// next
import NextLink from 'src/utils/link';
// components
import NewsLetter from './newsletter';

import MainLogo from 'src/components/mainLogo';

// icons
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { MdOutlineLocationOn } from 'react-icons/md';
import { FiMail } from 'react-icons/fi';
import { MdOutlineCall } from 'react-icons/md';

const SOCIAL_MEDIA_LINK = [
  {
    linkPath: 'https://www.facebook.com/techgater',
    icon: <FaFacebookF size={18} />
  },
  {
    linkPath: 'https://www.instagram.com/techgater',
    icon: <FaInstagram size={18} />
  },
  {
    linkPath: 'https://www.linkedin.com/company/89683736/admin',
    icon: <FaLinkedinIn size={18} />
  }
];

const ADDRESS = [
  {
    name: ' 8819 Ohio St. South Gate, CA 90280',
    icon: <MdOutlineLocationOn />
  },
  {
    name: 'Ourstudio@hello.com',
    linkPath: '/',
    icon: <FiMail fontSize={20} />
  },
  {
    name: '+1 386-688-3295',
    linkPath: '/',
    icon: <MdOutlineCall />
  }
];

const MAIN_LINKS = [
  {
    heading: 'Resource',
    listText1: 'Support',
    listLink1: '#',
    listText2: 'Updates',
    listLink2: '#',
    listText3: 'Roadmap',
    listLink3: '#',
    listText4: 'Providers',
    listLink4: '#',
    listText5: 'Affiliat',
    listLink5: '#'
  },
  {
    heading: 'Company',
    listText1: 'Product',
    listLink1: '#',
    listText2: 'Men',
    listLink2: '#',
    listText3: 'Women',
    listLink3: '#',
    listText4: 'Kids',
    listLink4: '#'
  }
];

export default function Footer() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        bgcolor: (theme) => alpha(theme.palette.info.light, 0.1),
        py: 4,
        overflow: 'hidden',
        position: 'relative',
        mt: 8,
        display: {
          md: 'block',
          xs: 'none'
        }
      }}
    >
      <Container fixed>
        <Grid container spacing={4}>
          <Grid item md={3}>
            <Stack spacing={3}>
              <MainLogo />
              <Typography variant="body1" color="text.secondary">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </Typography>
              <Stack>
                {ADDRESS.map((item, idx) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }} key={idx}>
                    <IconButton
                      sx={{
                        svg: {
                          color: theme.palette.primary.main
                        }
                      }}
                    >
                      {item.icon}
                    </IconButton>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      component={NextLink}
                      href={`${item.linkPath}`}
                      sx={{
                        ':hover': {
                          color: theme.palette.primary.main
                        }
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Grid>
          {MAIN_LINKS.map((item, idx) => (
            <Grid item md={2} key={idx}>
              <Stack spacing={3}>
                <Typography variant="h4" color="text.primary">
                  {item.heading}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  <Link
                    href={`${item.listLink1}`}
                    component={NextLink}
                    underline="none"
                    sx={{
                      color: 'text.secondary',
                      transition: '0.3s ease-in-out',
                      ':hover': {
                        color: theme.palette.primary.main,
                        transform: 'translateX(10px)'
                      }
                    }}
                  >
                    {item.listText1}
                  </Link>
                  <Link
                    href={`${item.listLink2}`}
                    component={NextLink}
                    underline="none"
                    sx={{
                      color: 'text.secondary',
                      transition: '0.3s ease-in-out',
                      ':hover': {
                        color: theme.palette.primary.main,
                        transform: 'translateX(10px)'
                      }
                    }}
                  >
                    {item.listText2}
                  </Link>
                  <Link
                    href={`${item.listLink3}`}
                    component={NextLink}
                    underline="none"
                    sx={{
                      color: 'text.secondary',
                      transition: '0.3s ease-in-out',
                      ':hover': {
                        color: theme.palette.primary.main,
                        transform: 'translateX(10px)'
                      }
                    }}
                  >
                    {item.listText3}
                  </Link>
                  <Link
                    href={`${item.listLink4}`}
                    component={NextLink}
                    underline="none"
                    sx={{
                      color: 'text.secondary',
                      transition: '0.3s ease-in-out',
                      ':hover': {
                        color: theme.palette.primary.main,
                        transform: 'translateX(10px)'
                      }
                    }}
                  >
                    {item.listText4}
                  </Link>
                  <Link
                    href={`${item.listLink5}`}
                    component={NextLink}
                    underline="none"
                    sx={{
                      color: 'text.secondary',
                      transition: '0.3s ease-in-out',
                      ':hover': {
                        color: theme.palette.primary.main,
                        transform: 'translateX(10px)'
                      }
                    }}
                  >
                    {item.listText5}
                  </Link>
                </Box>
              </Stack>
            </Grid>
          ))}

          <Grid item md={5}>
            <Stack spacing={3}>
              <Typography variant="h4" color="text.primary">
                Join a Newsletter
              </Typography>
              <NewsLetter />

              <Stack direction="row" alignItems="center" spacing={2}>
                {SOCIAL_MEDIA_LINK.map((item, idx) => (
                  <Fab
                    size="small"
                    color="primary"
                    key={idx}
                    component={NextLink}
                    href={item.linkPath}
                    sx={{
                      zIndex: 1
                    }}
                  >
                    {item.icon}
                  </Fab>
                ))}
              </Stack>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Typography variant="body1" color="text.primary" textAlign="center">
          © 2024 Nextall. All rights reserved
        </Typography>
      </Container>
    </Box>
  );
}
