// mui
import { Box } from '@mui/material';
import Container from '@mui/material/Container';

// components
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

          <ProductList category={categoryData} fetchFilters={'getFiltersByCategory'} />
        </Container>
      </Box>
    </Box>
  );
}
