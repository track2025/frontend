'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { useSelector } from 'src/lib/redux';
import { createTheme } from '@mui/material/styles';
import palette from './palette';
import typography from './typography';
import breakpoints from './breakpoints';
import shape from './shape';
import shadows, { customShadows } from './shadows';
import componentsOverride from './overrides';
import { usePathname } from 'next/navigation';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import * as locales from '@mui/material/locale';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

ThemeRegistry.propTypes = {
  children: PropTypes.node.isRequired
};

const Localization = (lang) => {
  switch (lang) {
    case 'ar':
      return 'arEG';
    case 'fr':
      return 'frFR';
    case 'en':
      return 'enUS';
    default:
      return 'frFR';
  }
};

export default function ThemeRegistry({ children }) {
  const { themeMode } = useSelector((state) => state.settings);
  const pathName = usePathname();
  const segments = pathName?.split('/');
  const lang = segments[1];
  const locale = Localization(lang);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin]
  });
  const customTheme = (outerTheme) =>
    createTheme(
      {
        palette: { ...palette.dark, mode: 'dark' },
        direction: dir,
        typography: typography,
        shadows: shadows.dark,
        shape,
        breakpoints,
        customShadows: customShadows.light
      },
      locales[locale]
    );
  // customTheme.components = componentsOverride(customTheme);
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={customTheme}>
        <main dir={dir}>
          <CssBaseline />
          {children}
        </main>
      </ThemeProvider>
    </CacheProvider>
  );
}
