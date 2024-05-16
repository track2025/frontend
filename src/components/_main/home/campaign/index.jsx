'use client';
// react
import React from 'react';
import NextLink from 'src/utils/link';
// mui
import { Typography, Grid, Box, Stack, Paper, Button } from '@mui/material';
// icons
import { IoIosArrowForward } from 'react-icons/io';
// component
import CompaginCard from 'src/components/cards/userCompagin';

export default function CampaignsComponent() {
  return (
    <Paper elevation={0}>
      <Stack
        direction={'column'}
        sx={{
          gap: 3,
          mt: 5
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h2" color="text.primary" mt={{ xs: 5, md: 8 }}>
              All Campaign
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={5}>
              All of Ours Campaigns{' '}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              borderRadius: 6
            }}
            endIcon={<IoIosArrowForward />}
            component={NextLink}
            href={``}
          >
            View More
          </Button>
        </Stack>

        <Box>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            {Array.from(new Array(6)).map((inner) => (
              <React.Fragment key={Math.random()}>
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <CompaginCard shop={inner} isLoading={false} />
                </Grid>
              </React.Fragment>
            ))}
            {/* {!isLoading && !Boolean(data?.data.length) && (
              <Typography variant="h3" color="error.main" textAlign="center">
                Shop not found
              </Typography>
            )} */}
          </Grid>
        </Box>
      </Stack>
    </Paper>
  );
}
