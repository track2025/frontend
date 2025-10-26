import React from 'react';
import { Container, Typography, Box, Grid, Stack } from '@mui/material';
import OrderDetails from 'src/components/_main/orders/orderDetails';
import TableCard from 'src/components/table/order';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Order Confirmation | Lap Snaps - Your Order Has Been Successfully Placed',
  description:
    'Congratulations! Your order has been successfully placed on Lap Snaps. Thank you for choosing us for your shopping needs. Expect fast processing and delivery. Stay tuned for updates on your order status. Shop more with Lap Snaps!',
  applicationName: 'Lap Snaps',
  authors: 'Lap Snaps',
  keywords:
    'order confirmation, Lap Snaps, order placed, successful order, order processing, order delivery, order status, order updates, fast delivery, shopping confirmation, shopping success, shopping updates, online shopping'
};

export default async function OrderMain({ params }) {
  const { oid } = params;
  let data;
  try {
    const response = await fetch(process.env.BASE_URL + '/api/orders/' + oid);
    if (!response.ok) {
      notFound();
    }
    const json = await response.json();
    data = json.data;
  } catch (error) {
    notFound();
  }

  return (
    <Box>
      <Container maxWidth="xl">
        <Stack spacing={1} textAlign="center" mt={8} mb={5} justifyContent="center" alignItems="center">
          <Typography variant="h3">Thank you for your purchase!</Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 600 }}>
            Thank you for your purchase. We truly value your business and are committed to providing outstanding
            service. You can download your order using the link below or the one sent to your email.
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.primary"
            sx={{
              span: {
                color: 'error.main'
              }
            }}
          >
            Order Number: <span>{data?.orderNo}</span>
          </Typography>
        </Stack>

        <Grid container direction={{ xs: 'row', md: 'row-reverse' }} spacing={2}>
          <Grid
            item
            sx={{
              width: {
                xs: '100%',
                md: '30%'
              }
            }}
          >
            <OrderDetails data={data} isLoading={false} currency={'$'} />
          </Grid>
          <Grid
            item
            sx={{
              width: {
                xs: '100%',
                md: '60%'
              }
            }}
          >
            <TableCard data={data} isLoading={false} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
