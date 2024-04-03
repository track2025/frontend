'use client';
// react
import React from 'react';

// mui
import { alpha } from '@mui/material/styles';
import { Typography, Container, Stack, Box, IconButton } from '@mui/material';
// next
import NextLink from 'next/link';
// components
import NewsLetter from './newsletter';

// icons
import { IoLogoInstagram } from 'react-icons/io5';
import { FaFacebook, FaLinkedin } from 'react-icons/fa';
import { IoLogoYoutube } from 'react-icons/io';

const SOCIAL_MEDIA_LINK = [
  {
    name: 'facebook',
    linkPath: 'https://www.facebook.com/techgater',
    icon: <FaFacebook className="facebook" />
  },
  {
    name: 'instagram',
    linkPath: 'https://www.instagram.com/techgater',
    icon: <IoLogoInstagram className="insta" />
  },
  {
    name: 'linkedin',
    linkPath: 'https://www.linkedin.com/company/89683736/admin',
    icon: <FaLinkedin className="linkedin" />
  },
  {
    name: 'youtube',
    linkPath: 'https://www.youtube.com/@techgaterwebsolutions7394',
    icon: <IoLogoYoutube className="youtube" />
  }
];

export default function Footer() {
  return (
    <Box
      sx={{
        // bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.2),
        bgcolor: 'background.paper',
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        py: 3,

        overflow: 'hidden',
        position: 'relative',
        // '&:before': {
        //   content: "''",
        //   position: 'absolute',
        //   bottom: '-50px',
        //   left: 100,
        //   bgcolor: (theme) => alpha(theme.palette.secondary.light, 0.77),
        //   height: 100,
        //   width: 100,
        //   borderRadius: '50px',
        //   zIndex: 0
        // },
        // '&:after': {
        //   content: "''",
        //   position: 'absolute',
        //   top: 100,
        //   right: '-50px',
        //   bgcolor: (theme) => alpha(theme.palette.secondary.light, 0.77),
        //   height: 100,
        //   width: 100,
        //   borderRadius: '50px',
        //   zIndex: 0
        // },
        display: {
          md: 'block',
          xs: 'none'
        }
      }}
    >
      <Container fixed>
        <Stack
          className="newsletter"
          spacing={1}
          sx={{
            textAlign: 'center',
            justifyContent: 'center',
            position: 'relative',
            width: '100%',
            maxWidth: 600,
            margin: 'auto',
            '&:before': {
              content: "''",
              position: 'absolute',
              top: '-80px',
              left: 0,
              ngcolor: (theme) => alpha(theme.palette.secondary.light, 0.77),
              height: 100,
              width: 100,
              borderRadius: '50px',
              zIndex: 0
            }
          }}
        >
          <Typography variant="h2" color="text.primary" fontWeight={700}>
            Newsletter
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry
            {`'`}s standard dummy text ever since the 1500s.
          </Typography>
          <NewsLetter />
          <Stack direction="row" spacing={3} justifyContent="center">
            {SOCIAL_MEDIA_LINK.map((item, index) => (
              <React.Fragment key={index}>
                <IconButton
                  aria-label=""
                  name={name}
                  component={NextLink}
                  href={item.linkPath}
                  target="_blank"
                  sx={{
                    color: (theme) =>
                      index === 0 || index === 2 ? theme.palette.primary.main : theme.palette.error.main,
                    fontSize: 28
                  }}
                >
                  {item.icon}
                </IconButton>
              </React.Fragment>
            ))}
          </Stack>
          <Typography variant="body1" color="text.primary" textAlign="center">
            © 2024 Nextall. All rights reserved
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
