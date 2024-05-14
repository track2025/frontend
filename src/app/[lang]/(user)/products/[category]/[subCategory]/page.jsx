// mui
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
// next
// lodash
import Filter from 'src/components/_main/products/filters';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import ProductList from 'src/components/_main/products';
import * as api from 'src/services';
export const dynamic = 'force-static';
export async function generateStaticParams() {
  const { data } = await api.getSubCategorySlugs();
  return data?.map((cat) => {
    return {
      subCategory: cat.slug,
      category: cat.parentCategory.slug
    };
  });
}

export async function generateMetadata({ params }) {
  const { data: response } = await api.getSubCategoryBySlug(params.subCategory);
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
  const { category, subCategory } = params;
  const { data: subCategoryData } = await api.getSubCategoryTitle(subCategory);

  return (
    <Box>
      <Box sx={{ bgcolor: 'background.default' }}>
        <Container fixed>
          <HeaderBreadcrumbs
            heading={subCategoryData?.name}
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
                name: subCategoryData?.parentCategory?.name,
                href: `/products/${category}`
              },
              {
                name: subCategoryData?.name
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
              <Filter
                fetchFilters={'getFiltersBySubCategory'}
                subCategory={subCategoryData}
                category={subCategoryData.parentCategory}
                pathname={`${subCategory}`}
              />
            </Grid>
            <Grid item md={9} xs={12}>
              <ProductList subCategory={subCategoryData} fetchFilters={'getFiltersByCategory'} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
