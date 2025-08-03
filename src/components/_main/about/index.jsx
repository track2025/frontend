'use client';
import React from 'react';
// material ui
import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
// images
import AboutImage from '../../../../public/images/about-1.png';
import AboutImage2 from '../../../../public/images/about-2.png';
// components
import WhyUs from '../home/whyUs';
import Team from './team';

const Data = [
  {
    name: 'Vendors',
    range: '65k+',
    description: 'Contrary to popular belief, Lorem is not simply random text.'
  },
  {
    name: 'Earnings',
    range: '$45B+',
    description: 'Contrary to popular belief, Lorem is not simply random text.'
  },
  {
    name: 'Sold',
    range: '25M+',
    description: 'Contrary to popular belief, Lorem is not simply random text.'
  },
  {
    name: 'Products',
    range: '70k+',
    description: 'Contrary to popular belief, Lorem is not simply random text.'
  }
];

export default function Index() {
  const theme = useTheme();

  return (
    <>
      <Box sx={{ my: 8 }}>
        <Grid container>
          
          <Grid item md={6} xs={12} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h6" fontSize="16px" textTransform="uppercase" color="primary">
              Who We Are?
            </Typography>
            <Typography variant="h2" fontWeight={800}>
            A Platform Where Race Cars Live Forever in Frames
            </Typography>
            <Typography variant="body1" fontWeight={400} color="text.secondary" mt={2}>
            Lap Snaps is the world’s first dedicated marketplace for high-quality race car photography — a platform where speed, precision, and visual storytelling converge. Built exclusively for motorsport photographers and enthusiasts, Lap Snaps offers a seamless environment where stunning images of race cars are bought and sold with ease, efficiency, and purpose. Our mission is simple but powerful: to elevate the value of race car photography and connect creators with those who appreciate, collect, and need the most dynamic automotive visuals available.
<br></br> <br></br>
In the world of motorsports, every fraction of a second matters — and so does every frame. Photographers across the globe capture breathtaking moments from race tracks, pit lanes, staging areas, and victory podiums, often under intense conditions and with a deep understanding of both the sport and the machine. These are more than just pictures — they’re time capsules of speed, performance, emotion, and engineering excellence. Until now, there hasn't been a dedicated platform where these photographs could live, thrive, and be accessed by a global audience. That’s where Lap Snaps comes in.
<br></br> <br></br>
Lap Snaps is designed to be a creative hub and professional sales tool for motorsport photographers. Whether you're shooting Formula 1, endurance racing, touring cars, drag events, rallycross, or grassroots time attack competitions, this platform gives you the ability to upload your images, organize your portfolio, set prices, and track every sale from a clean, intuitive dashboard. We've made it easy for photographers to monetize their craft without jumping through the hoops of traditional licensing platforms or generic stock photo websites. Every image you upload to Lap Snaps is presented to an audience that genuinely values motorsport content — from racing teams and automotive brands to media houses, collectors, sponsors, content creators, and passionate fans.
<br></br> <br></br>
For buyers, Lap Snaps is a goldmine of exclusive, high-resolution race car photography. Whether you need dramatic action shots for editorial use, sponsor decks, brand campaigns, or personal collections, you’ll find an unparalleled range of imagery here. Our library includes thousands of photos from international circuits and local tracks alike — showcasing cars in motion, technical details, car liveries, driver portraits, night races, pre-grid intensity, pit stop chaos, and finish-line glory. With our advanced search features, users can explore images by series, event, team, location, car type, and even photographer — making it easy to find exactly what you're looking for in seconds.
<br></br> <br></br>
What sets Lap Snaps apart is our unwavering focus on the racing world. This isn't a platform where your work competes with wedding photos, travel shots, or lifestyle content. Every photo, every buyer, and every tool is designed with one purpose in mind: motorsport photography. We are building a dedicated ecosystem where creators are respected, work is protected, and value is shared fairly between artist and audience.
<br></br> <br></br>
Our commitment goes beyond just being a marketplace. We are creating a living archive of racing history through the eyes of the photographers who capture it. Lap Snaps supports independent professionals, emerging talents, and seasoned veterans alike, offering a level playing field where quality and passion rise to the top. As the world of racing evolves, with new technologies, disciplines, and audiences, our platform will continue to grow — serving as the digital home for the most iconic and undiscovered race car images in the world.
<br></br> <br></br>
At Lap Snaps, we believe race cars are more than machines — they are legends in motion. And the photographs that capture them are not just files; they are art, history, and inspiration. Whether you're here to sell your work, build your brand, find the perfect shot, or simply explore the beauty of motorsport through a photographer’s lens, Lap Snaps welcomes you to a world where the thrill of racing meets the power of photography.


            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ marginTop: 5 }}>
          <Typography variant="h3" fontWeight={700} textAlign="center">
            Our Services
          </Typography>
          <Typography
            variant="body1"
            fontWeight={400}
            color="text.secondary"
            sx={{ maxWidth: 350, textAlign: 'center', mx: 'auto' }}
          >
            Customer service should not be a department. It should be the entire company.
          </Typography>
        </Box>
      </Box>
      {/* WhyUs  */}
      <WhyUs />
      <Box sx={{ marginY: { md: 10, sm: 8, xs: 5 } }}>
        <Grid container className="row" >
          {Data.map((item, idx) => (
            <Grid item md={3} sm={6} xs={12} key={Math.random()} className="mb-3 col-md-3 col-sm-6 col-xs-12">
              <Stack
                textAlign="center"
                sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, p: 2 }}
                key={idx}
              >
                <Typography variant="h3" color="text.secondary">
                  {item?.range}
                </Typography>
                <Typography variant="h3" color="text.primary">
                  {item?.name}
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight={400}
                  color="text.secondary"
                  sx={{ maxWidth: 350, textAlign: 'center', mx: 'auto' }}
                >
                  {item?.description}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ paddingBottom: 10 }}>
        <Typography variant="h3" fontWeight={700} textAlign="center">
          Our Team
        </Typography>
        <Typography
          variant="body1"
          fontWeight={400}
          color="text.secondary"
          sx={{ maxWidth: 350, textAlign: 'center', mx: 'auto' }}
        >
          Meet out expert team members.
        </Typography>
        <Grid container className="row" mt={5}>
          {[1, 2, 3, 4].map((index) => (
            <Grid item md={3} sm={2} xs={6} key={index}  className="col-md-3 col-sm-2 col-xs-6 mb-3">
              <Team />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
