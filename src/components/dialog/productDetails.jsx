import * as React from 'react';
import Dialog from '@mui/material/Dialog';

// api
import * as api from 'src/services';
// usequery
import { useQuery } from 'react-query';
import ProductDetailsCarousel from 'src/components/carousels/customPaginationSilder';
import { Grid } from '@mui/material';
import PropTypes from 'prop-types';
import DetailsSkeleton from 'src/components/skeletons/productDetail';
import ProductDetailsSumaryMobile from '../_main/product/mobileSummary';
ProductDetailsDialog.propTypes = {
  slug: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.required
};

export default function ProductDetailsDialog(props) {
  const { onClose, open, slug } = props;

  const { data, isLoading } = useQuery(['coupon-codes', slug], () => api.getProductBySlug(slug));

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="md">
      {isLoading ? (
        <DetailsSkeleton isPopup />
      ) : (
        <Grid container spacing={2} justifyContent="center" sx={{ p: 3 }}>
          <Grid item xs={12} md={6} lg={6}>
            <ProductDetailsCarousel slug={slug} product={data?.data} data={data?.data} />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <ProductDetailsSumaryMobile
              id={data?.data?._id}
              product={data?.data}
              brand={data?.brand}
              category={data?.category}
              totalRating={data?.totalRating}
              totalReviews={data?.totalReviews}
            />
          </Grid>
        </Grid>
      )}
    </Dialog>
  );
}
