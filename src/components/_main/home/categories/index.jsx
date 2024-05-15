'use client';
// react
import React from 'react';
import NextLink from 'src/utils/link';
// mui
import { Typography, Grid, Box, Stack, Paper, Button } from '@mui/material';
import { IoIosArrowForward } from 'react-icons/io';
// component
import CategoryCard from 'src/components/cards/category';
import { useSelector } from 'react-redux';

export default function Categories() {
  const { newCategories, isLoading } = useSelector(({ categories }) => categories);
  return (
    <Paper elevation={0}>
      <Stack
        direction={'column'}
        sx={{
          gap: 3,
          mt: 5
        }}
      >
        <Box>
          <Typography variant="h2" color="text.primary" textAlign="center">
            Top Categories
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry.
          </Typography>
        </Box>
        <Box>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            {(isLoading ? Array.from(new Array(6)) : newCategories).map((inner) => (
              <React.Fragment key={Math.random()}>
                <Grid item lg={2} md={3} sm={4} xs={4}>
                  <CategoryCard category={inner} isLoading={isLoading} />
                </Grid>
              </React.Fragment>
            ))}
            {!isLoading && !Boolean(newCategories.length) && (
              <Typography variant="h3" color="error.main" textAlign="center">
                Categories not found
              </Typography>
            )}
          </Grid>
        </Box>
        {Boolean(newCategories?.length > 3) && (
          <Button
            variant="text"
            color="primary"
            endIcon={<IoIosArrowForward />}
            component={NextLink}
            href={`/categories`}
            sx={{
              mt: 3,
              mx: 'auto',
              display: 'flex',

              minWidth: 100
            }}
          >
            View All Categories
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
