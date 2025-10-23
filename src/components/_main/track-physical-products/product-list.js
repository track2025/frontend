import PropTypes from 'prop-types';
// mui
import { Box, Grid } from '@mui/material';
// components
import ProductCard from 'src/components/cards/physical-product';
import NoDataFoundIllustration from 'src/illustrations/dataNotFound';

export default function ProductList({ ...props }) {
  const { data, isLoading, isMobile } = props;
  const products = data?.data;

  return (
    <Box mb={3} mt={2}>
      <Grid container spacing={isMobile ? 1 : 2}>
        {!isLoading && products?.length < 1 && <NoDataFoundIllustration />}
        {(isLoading ? Array.from(new Array(8)) : products)?.map((product) => (
          <Grid key={Math.random()} size={{ lg: 3, md: 3, sm: 4, xs: 6 }} sx={{ transition: 'all 0.3s ease-in-out' }}>
            <ProductCard product={product} loading={isLoading} isMobile={isMobile} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// add propTypes
ProductList.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired
};
