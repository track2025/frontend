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
            <Typography variant="body1" fontWeight={400} color="text.secondary" mt={2}>
            At Lap Snaps, we are passionate about motorsport and photography. Our mission is simple: to make it effortless for photographers to share their work and for drivers and riders to find lasting memories of their time on track.
<br /> <br />
<b>Why We Exist</b>
<br />
At every track day, photographers capture incredible moments. Yet selling those photos is often awkward and unreliable. Many end up giving their work away for free or relying on photo shoots that rarely happen. At the same time, car and bike owners leave the track searching social media, hoping to find even one good shot of their vehicle.
 <br /> <br />
Lap Snaps bridges that gap by creating a professional platform where photographers can showcase and sell their work, and where vehicle owners can easily discover and purchase it.


<br /> <br />
<b>For Photographers</b>
<br />
Lap Snaps gives photographers a dedicated space to turn their passion into income. You can upload up to one thousand photos or videos at a time, with automatic watermarking to protect your work. Each upload can be tagged with track, date, vehicle make and model, and registration details, making it simple for owners to find themselves in your gallery.
<br /> <br />
Every photographer receives a personal shop page with a profile and banner, along with a unique QR code that can be printed or shared at events. You set your own pricing and earn revenue automatically whenever a photo or video is purchased. There are no subscription or sign-up fees, making it completely free to start using.


<br /> <br />
<b>For Drivers and Riders</b>
<br />
Lap Snaps makes it simple for car and bike owners to relive their time on track. You can search by track, date, vehicle details, or registration number to locate media of your vehicle. Once you find a photographer you like, you can follow their page and receive notifications whenever new photos or videos of your car or bike are uploaded.

<br /> <br />
<b>Our Vision</b>
<br />
Lap Snaps is designed to revolutionize the way motorsport memories are captured and shared. By removing barriers for photographers and making it easy for drivers and riders to discover media of their vehicles, we are building a community where every moment on track can be preserved and celebrated.
<br /> <br />
Whether you are behind the lens or behind the wheel, Lap Snaps is your home for motorsport media.





            </Typography>
          </Grid>
        </Grid>
        
      </Box>
      {/* WhyUs  */}
      <WhyUs />
      
     
    </>
  );
}
