// mui
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import ShopDetailCover from 'src/components/_admin/shops/shopDetailCover';

// components
import Filter from 'src/components/_main/products/filters';
import ProductList from 'src/components/_main/products';

export default async function Listing({ params }) {
  const { shop } = params;
  const response = await fetch(process.env.BASE_URL + '/api/shop-title/' + shop).then((res) => res.json());
  if (!response) {
    notFound();
  }
  const { data: shopData } = response;
  // console.log(shopData, 'shopData');
  return (
    <Box>
      <Box sx={{ bgcolor: 'background.default' }}>
        <Container fixed>
          {/* <HeaderBreadcrumbs
            heading={shopData?.title}
            links={[
              {
                name: 'Home',
                href: '/'
              },
              {
                name: 'Shops',
                href: '/shops'
              },
              {
                name: shopData?.title
              }
            ]}
          /> */}
          <Box mt={3}>
            <ShopDetailCover isUser data={shopData} isLoading={false} />
          </Box>

          <ProductList shop={shopData} fetchFilters={'getFiltersByShop'} />
        </Container>
      </Box>
    </Box>
  );
}
