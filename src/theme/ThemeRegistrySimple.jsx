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
  const [themeMode, setThemeMode] = React.useState('light');
  const [isClient, setIsClient] = React.useState(false);
  const isRTL = false;
  
  React.useEffect(() => {
    setIsClient(true);
    
    const themeCookie = document.cookie.split('; ').find(row => row.startsWith('themeMode='));
    const cookieTheme = themeCookie ? themeCookie.split('=')[1] : null;
    
    if (cookieTheme) {
      setThemeMode(cookieTheme);
    } else {
      document.cookie = 'themeMode=light; path=/; max-age=31536000; SameSite=Lax';
    }
    
    const handleThemeChange = () => {
      const themeCookie = document.cookie.split('; ').find(row => row.startsWith('themeMode='));
      const newTheme = themeCookie ? themeCookie.split('=')[1] : 'light';
      setThemeMode(newTheme);
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
    <div suppressHydrationWarning>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          {isClient && <CssBaseline enableColorScheme />}
          {children}
        </ThemeProvider>
      </CacheProvider>
    </div>
  );
}