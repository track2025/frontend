'use client';
import React, { useContext } from 'react';
// redux
import { useDispatch, useSelector, ReactReduxContext } from 'react-redux';
import { setThemeMode } from 'src/redux/slices/settings';

// icons
import { IoSunny } from 'react-icons/io5';
import { IoMoonOutline } from 'react-icons/io5';
// mui
import { IconButton, alpha } from '@mui/material';

export default function SettingMode({ isAdmin }) {
  // Check if Redux is available
  const reduxContext = useContext(ReactReduxContext);
  
  // Always call hooks unconditionally (React rules)
  const settings = useSelector(({ settings }) => settings);
  const dispatch = useDispatch();
  
  // Get theme mode - use Redux if available, otherwise default to light
  const themeMode = reduxContext && settings ? settings.themeMode : 'light';
  
  const handleToggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    
    // Always use Redux dispatch - it handles cookie saving in the reducer
    dispatch(setThemeMode(newMode));
  };
  
  return (
    <IconButton
      name="setting-mode"
      onClick={handleToggleTheme}
      size="medium"
      color={isAdmin ? 'default' : 'primary'}
      sx={{
        // ...(!isAdmin && {
        //   borderColor: 'primary',
        //   borderWidth: 1,
        //   borderStyle: 'solid',
        //   bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1)
        // })
      }}
    >
      {themeMode === 'dark' ? <IoSunny size={24} /> : <IoMoonOutline size={24} />}
    </IconButton>
  );
}
