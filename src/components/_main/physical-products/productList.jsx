import PropTypes from 'prop-types';
// mui
import { Box, Grid } from '@mui/material';
// components
import ProductCard from 'src/components/cards/product';
import NoDataFound from 'src/illustrations/dataNotFound';
export default function ProductList({ ...props }) {
  const { data, isLoading, isMobile } = props;
  const products = data?.data;

  return (
    <Box my={3}>
      <Grid container className="row" spacing={isMobile ? 1 : 0}>

        {!isLoading && products?.length < 1 && <NoDataFound />}
        {(isLoading ? Array.from(new Array(8)) : products)?.map((product) => (
          <div className="col-lg-3 col-md-4 ">
             <Grid  key={Math.random()} item  className="col-12" sx={{ transition: 'all 0.3s ease-in-out' }}>
            <ProductCard product={product} loading={isLoading} isMobile={isMobile} className="" />
          </Grid>
          </div>
         
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
