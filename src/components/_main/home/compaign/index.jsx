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
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';

export default function CompaignsComponent() {
  const { data, isLoading } = useQuery(['get-home-compaign-all'], () => api.getHomeCompaigns('?limit=4'));
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
              All Compaigns
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={5}>
              All of Ours Compaigns{' '}
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
            href={`/compaigns`}
          >
            View More
          </Button>
        </Stack>

        <Box>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            {(isLoading ? Array.from(new Array(6)) : data?.data).map((inner) => (
              <React.Fragment key={Math.random()}>
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <CompaginCard compaign={inner} isLoading={isLoading} />
                </Grid>
              </React.Fragment>
            ))}
            {!isLoading && !Boolean(data?.data.length) && (
              <Typography variant="h3" color="error.main" textAlign="center">
                Compaigns not found
              </Typography>
            )}
          </Grid>
        </Box>
      </Stack>
    </Paper>
  );
}
