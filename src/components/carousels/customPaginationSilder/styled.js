import { styled, alpha } from '@mui/material/styles';
import { Box } from '@mui/material';
const RootStyled = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 156,
  '& > .carousel-wrap': {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    aspectRatio: '1/1', // Modern aspect-ratio control
    borderRadius: 0,
    
    '& .slide-wrapper': {
      position: 'absolute', // Changed from relative
      width: '100%',
      height: '100%', // Fill parent completely
      top: 0,
      left: 0,
      zIndex: 11,
      backgroundColor: 'transparent',
      borderRadius: 0,
      
      '& img': {
        position: 'absolute',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'top center', // Align to top
        borderRadius: '8px',
        border: `1px solid ${theme.palette.divider}`,
        ...(theme.direction === 'rtl' && {
          transform: 'scaleX(-1)'
        })
      }
    },
    
    '& .bg-overlay': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: theme.palette.mode === 'dark' 
        ? alpha(theme.palette.grey[800], 0.2) 
        : ''
    }
  }
}));
export default RootStyled;
