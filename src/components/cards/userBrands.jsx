import React from 'react';
import { uniqueId } from 'lodash';
import PropTypes from 'prop-types';
// mui
import { Grid, Card, Typography, Skeleton, IconButton, Box, Stack } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
// lodash
import { capitalize } from 'lodash';
// components
import BlurImage from 'src/components/blurImage';
import Label from 'src/components/label';
import { fDateShort } from 'src/utils/formatTime';
// icons
import { MdDelete } from 'react-icons/md';
import { MdEdit } from 'react-icons/md';
// next
import { useRouter } from 'src/hooks/useRouter';

const RootStyle = styled(Card)(({ theme }) => ({}));

export default function UserBrandsCard({ item, isLoading }) {
  const theme = useTheme();
  const router = useRouter();
  return (
    <RootStyle key={uniqueId()}>
      {isLoading ? (
        <Skeleton variant="rectangular" width={50} height={50} sx={{ borderRadius: 1 }} />
      ) : (
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            height: 50,
            width: 50,
            minWidth: 50,
            borderRadius: 1,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <BlurImage priority fill alt={item?.name} src={item?.logo?.url} objectFit="cover" />
        </Box>
      )}
      <Typography noWrap variant="h6">
        {isLoading ? <Skeleton variant="text" /> : capitalize(item.name).slice(0, 20)}
      </Typography>
    </RootStyle>
  );
}
UserBrandsCard.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.string,
    logo: PropTypes.shape({
      url: PropTypes.string
    }),
    createdAt: PropTypes.string,
    status: PropTypes.string,
    slug: PropTypes.string
  }),
  isLoading: PropTypes.bool,
  handleClickOpen: PropTypes.func
};
