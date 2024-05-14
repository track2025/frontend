// mui
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

// components
import Filter from 'src/components/_main/products/filters';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import ProductList from 'src/components/_main/products';
import * as api from 'src/services';
export const dynamic = 'force-static';
export async function generateStaticParams() {
  const { data } = await api.getCategorySlugs();
  const mapped = data?.map((cat) => {
    return {
      category: cat.slug
    };
  });
  console.log(mapped, 'mapped');
  return mapped;
}

export async function generateMetadata({ params }) {
  const { data: response } = await api.getCategoryBySlug(params.category);

  // const images = category.images.map((img) => img.url);
  return {
    title: response.metaTitle,
    description: response.metaDescription,
    title: response.name,
    openGraph: {
      images: [response.cover.url]
    }
  };
}

export default async function Listing({ params }) {
  const { category } = params;
  const { data: categoryData } = await api.getCategoryTitle(category);

  return (
    <Box>
      <Box sx={{ bgcolor: 'background.default' }}>
        <Container fixed>
          <HeaderBreadcrumbs
            heading={categoryData?.name}
            links={[
              {
                name: 'Home',
                href: '/'
              },
              {
                name: 'Products',
                href: '/products'
              },
              {
                name: categoryData?.name
              }
            ]}
          />
          <Grid container spacing={3}>
            <Grid
              item
              md={3}
              xs={0}
              sx={{
                display: { xs: 'none', md: 'block' }
              }}
            >
              <Filter pathname={`${category}`} />
            </Grid>
            <Grid item md={9} xs={12}>
              <ProductList category={categoryData} fetchFilters={'getFiltersByCategory'} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
