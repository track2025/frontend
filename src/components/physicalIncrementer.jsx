// mui
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

// mui
import { Typography, Stack, IconButton } from '@mui/material';

// icons
import { IoIosRemove } from 'react-icons/io';
import { IoIosAdd } from 'react-icons/io';

const IncrementerStyle = styled('div')(({ theme }) => ({
  // border: '1px solid ' + theme.palette.divider,
  // // borderRadius: 27,
  // display: 'flex',
  // alignItems: 'center',
  // justifyContent: 'space-between',
  // svg: {
  //   fontSize: 22
  // }
}));
const _styles = {
  display: 'flex',
  borderRadius: '8px',
  border: '1px solid #ccc',
  outline: 'none',
  fontSize: '14px',
  textTransform: 'uppercase',
  backgroundColor: '#f4f4f4',
  borderWidth: 0,
  outline:'none',
  width: 100,
  alignItems: 'center'
}

function PhysicalIncrementer({ ...props }) {
  const { stockQuantity, quantity, onIncrease, onDecrease, cart } = props;

  return (
    <Stack gap={0.5} className='w-full'>
      <IncrementerStyle
      style={_styles}
        sx={{
          gap: cart ? 0.5 : 1,
          p: cart ? 0.2 : 0.5
        }}
      >
        <IconButton size="small" color="primary" onClick={onDecrease} disabled={quantity <= 1}>
          <IoIosRemove />
        </IconButton>
        <Typography variant="subtitle1" color="text.primary" style={{
          width: 50
        }}>
          {quantity}
        </Typography>

        <IconButton size="small" color="primary" onClick={onIncrease} disabled={quantity >= stockQuantity}>
          <IoIosAdd />
        </IconButton>
      </IncrementerStyle>
      {cart && (
        <Typography variant="caption" color="text.secondary">
          Available: {stockQuantity}
        </Typography>
      )}
    </Stack>
  );
}

export default PhysicalIncrementer;

PhysicalIncrementer.propTypes = {
  stockQuantity: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  onIncrease: PropTypes.func.isRequired,
  onDecrease: PropTypes.func.isRequired
};
