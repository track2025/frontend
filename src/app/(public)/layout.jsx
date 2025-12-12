import { Toolbar, Box } from '@mui/material';
import ThemeRegistrySimple from 'src/theme/ThemeRegistrySimple';
import Footer from 'src/layout/_main/footer';
import Topbar from 'src/layout/_main/topbar';
import Navbar from 'src/layout/_main/navbar';
import ActionBar from 'src/layout/_main/actionbar';

export default function PublicLayout({ children }) {
  return (
    <ThemeRegistrySimple>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Topbar />
        <Navbar />
        <ActionBar />
        {children}
        <Toolbar sx={{ display: { xs: 'block', md: 'none' } }} />
        <Footer />
      </Box>
    </ThemeRegistrySimple>
  );
}