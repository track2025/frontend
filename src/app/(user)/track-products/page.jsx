// mui
import { Box, Container } from '@mui/material';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import ProductList from 'src/components/_main/track-products';
import FilterChips from 'src/components/_main/track-products/search-params-list';

const baseUrl = process.env.BASE_URL;

export default async function Listing() {
  const res = await fetch(`${baseUrl}/api/products/filters`, {
    next: { revalidate: 60 } // Revalidate every 60 seconds
  });

  const response = await res.json();

  const { data: filters } = response;

  return (
    <Box>
      <Box sx={{ bgcolor: 'background.default' }}>
        <Container maxWidth="xl">
          <HeaderBreadcrumbs
            heading="Track Products"
            links={[
              {
                name: 'Home',
                href: '/'
              },
              {
                name: 'Track Products'
              }
            ]}
          />
          <Box>
            <FilterChips />
          </Box>
          <ProductList filters={filters} />
        </Container>
      </Box>
    </Box>
  );
}
