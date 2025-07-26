// mui
import { Box, Container } from '@mui/material';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import ProductList from 'src/components/_main/products';

export default async function Listing() {
  return (
    <Box>
      <Box sx={{ bgcolor: 'background.default' }}>
        <Container maxWidth="xl">
          <HeaderBreadcrumbs
            heading="Media"
            links={[
              {
                name: 'Home',
                href: '/'
              },
              {
                name: 'Media'
              }
            ]}
          />

          <ProductList />
        </Container>
      </Box>
    </Box>
  );
}
