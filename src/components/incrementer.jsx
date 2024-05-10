// mui
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Box, Typography, IconButton, useTheme, Stack } from '@mui/material';
import { IoIosRemove } from 'react-icons/io';
import { IoIosAdd } from 'react-icons/io';

// Incrementer Style
const IncrementerStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0.5, 0.75)
  // borderRadius: theme.shape.borderRadius,
  // border: `solid 1px ${theme.palette.divider}`
}));

function Incrementer({ ...props }) {
  const { available, quantity, onIncrease, onDecrease } = props;
  const theme = useTheme();
  return (
    <Stack sx={{ width: 96, mb: 0 }}>
      <IncrementerStyle>
        <IconButton
          size="small"
          color="inherit"
          onClick={onDecrease}
          disabled={quantity <= 1}
          sx={{
            bgcolor: theme.palette.grey[300],
            border: `solid 1px ${theme.palette.divider}`,
            borderRadius: '50%'
          }}
        >
          <IoIosRemove size={16} />
        </IconButton>
        {quantity}
        <IconButton
          size="small"
          color="inherit"
          onClick={onIncrease}
          disabled={quantity >= available}
          sx={{
            bgcolor: theme.palette.primary.extraLight + '!important',
            border: `solid 1px ${theme.palette.primary.main}`,
            borderRadius: '50%'
          }}
        >
          <IoIosAdd size={16} />
        </IconButton>
      </IncrementerStyle>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        Available: {available}
      </Typography>
    </Stack>
  );
}

export default Incrementer;
Incrementer.propTypes = {
  available: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  onIncrease: PropTypes.func.isRequired,
  onDecrease: PropTypes.func.isRequired
};
