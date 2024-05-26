// mui
import { Box } from '@mui/material';
// import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import ProductList from 'src/components/_main/products';

export default async function Listing() {
  return (
    <Box>
      <Box sx={{ bgcolor: 'background.default' }}>
        <Container fixed>
          <HeaderBreadcrumbs
            heading="Products"
            links={[
              {
                name: 'Home',
                href: '/'
              },
              {
                name: 'Products'
              }
            ]}
          />

          <ProductList />
        </Container>
      </Box>
    </Box>
  );
}
