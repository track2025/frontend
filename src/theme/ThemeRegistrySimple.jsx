'use client';
import * as React from 'react';
import PropTypes from 'prop-types';

// mui
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';

// emotion
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

// custom theme
import palette from './palette';
import typography from './typography';
import breakpoints from './breakpoints';
import shape from './shape';
import shadows, { customShadows } from './shadows';
import componentsOverride from './overrides';

ThemeRegistrySimple.propTypes = {
  children: PropTypes.node.isRequired
};

export default function ThemeRegistrySimple({ children }) {
  // Get initial theme from cookies (works on server and client)
  const getInitialTheme = () => {
    if (typeof document === 'undefined') return 'light';
    const themeCookie = document.cookie.split('; ').find(row => row.startsWith('themeMode='));
    return themeCookie ? themeCookie.split('=')[1] : 'light';
  };
  
  // Initialize state with cookie value to prevent hydration mismatch
  const [themeMode, setThemeMode] = React.useState(() => getInitialTheme());
  const isRTL = false;
  
  // Listen for theme changes from other components
  React.useEffect(() => {
    const handleThemeChange = () => {
      if (typeof document !== 'undefined') {
        const themeCookie = document.cookie.split('; ').find(row => row.startsWith('themeMode='));
        const newTheme = themeCookie ? themeCookie.split('=')[1] : 'light';
        setThemeMode(newTheme);
      }
    };
    
    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  const themeOptions = React.useMemo(
    () => ({
      breakpoints,
      palette: palette[themeMode],
      shape,
      typography,
      shadows: shadows[themeMode],
      customShadows: customShadows[themeMode],
      direction: isRTL ? 'rtl' : 'ltr'
    }),
    [themeMode, isRTL]
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  const cache = React.useMemo(
    () =>
      createCache({
        key: isRTL ? 'rtl' : 'css',
        prepend: true,
        stylisPlugins: isRTL ? [require('stylis-plugin-rtl')] : []
      }),
    [isRTL]
  );

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div suppressHydrationWarning>{children}</div>
      </ThemeProvider>
    </CacheProvider>
  );
}
