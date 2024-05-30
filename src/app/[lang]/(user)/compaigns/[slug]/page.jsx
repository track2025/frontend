// mui
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import ShopDetailCover from 'src/components/_admin/shops/shopDetailCover';
import ProductList from 'src/components/_main/products';
import * as api from 'src/services';
export const dynamic = 'error';
export async function generateStaticParams() {
  const { data } = await api.getCompaignSlugs();
  const mapped = data?.map((compaign) => {
    return {
      slug: compaign.slug
    };
  });
  return mapped;
}

export async function generateMetadata({ params }) {
  const { data: response } = await api.getCompaignBySlug(params.slug);

  return {
    title: response.metaTitle,
    description: response.metaDescription,
    title: response.title,
    openGraph: {
      images: [response.cover.url]
    }
  };
}
export default async function Listing({ params }) {
  const { slug } = params;
  const { data: compaign } = await api.getCompaignTitle(slug);

  return (
    <Box>
      <Box sx={{ bgcolor: 'background.default' }}>
        <Container maxWidth="xl">
          <Box mt={3}>
            <ShopDetailCover page={'compaigns'} isUser data={compaign} isLoading={false} />
          </Box>

          <ProductList compaign={compaign} fetchFilters={'getFiltersByShop'} />
        </Container>
      </Box>
    </Box>
  );
}
