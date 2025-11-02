import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next-nprogress-bar';

// mui
import { styled } from '@mui/material/styles';
import { Box, TableRow, Skeleton, TableCell, Typography, Stack, IconButton, Tooltip, Chip } from '@mui/material';

// icons
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';

// components
import BlurImage from 'src/components/blurImage';

// utils
import { fDateShort } from 'src/utils/formatTime';

PhysicalSubCategoryRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
    cover: PropTypes.shape({
      url: PropTypes.string.isRequired
    }).isRequired,
    slug: PropTypes.string.isRequired
  }).isRequired,
  handleClickOpen: PropTypes.func.isRequired
};

const ThumbImgStyle = styled(Box)(({ theme }) => ({
  width: 50,
  height: 50,
  minWidth: 50,
  objectFit: 'cover',
  background: theme.palette.background.default,
  marginRight: theme.spacing(2),
  border: '1px solid ' + theme.palette.divider,
  borderRadius: theme.shape.borderRadiusSm,
  position: 'relative',
  overflow: 'hidden'
}));
export default function PhysicalSubCategoryRow({ isLoading, row, handleClickOpen, sn }) {
  const router = useRouter();
  // const theme = useTheme();

  return (
    <TableRow hover key={Math.random()}>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{sn}</>}</TableCell>
      <TableCell component="th" scope="row">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {isLoading ? (
            <Skeleton variant="rounded" width={50} height={50} sx={{ borderRadius: 1 }} />
          ) : (
            <ThumbImgStyle>
              <BlurImage priority fill alt={row?.name} src={row?.cover?.url} objectFit="cover" />
            </ThumbImgStyle>
          )}
          <Typography variant="subtitle2" noWrap>
            {isLoading ? <Skeleton variant="text" width={120} sx={{ ml: 1 }} /> : row?.name}
          </Typography>
        </Box>
      </TableCell>
      <TableCell component="th" scope="row">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {isLoading ? (
            <Skeleton variant="rounded" width={50} height={50} sx={{ borderRadius: 1 }} />
          ) : (
            <ThumbImgStyle>
              <BlurImage
                priority
                fill
                alt={row?.parentCategory?.name}
                src={row?.parentCategory?.cover?.url}
                objectFit="cover"
              />
            </ThumbImgStyle>
          )}
          <Typography variant="subtitle2" noWrap>
            {isLoading ? <Skeleton variant="text" width={120} sx={{ ml: 1 }} /> : row?.parentCategory?.name}
          </Typography>
        </Box>
      </TableCell>

      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Chip
            size="small"
            label={row?.status}
            color={row?.status?.toLowerCase() === 'active' ? 'success' : 'error'}
          />
        )}
      </TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <> {fDateShort(row.createdAt)} </>}</TableCell>
      <TableCell align="right">
        <Stack direction="row" justifyContent="flex-end">
          {isLoading ? (
            <>
              <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
              <Skeleton variant="circular" width={34} height={34} />
            </>
          ) : (
            <>
              <Tooltip title="Edit">
                <IconButton onClick={() => router.push(`/admin/physical-categories/sub-categories/${row?.slug}`)}>
                  <MdEdit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={handleClickOpen(row.slug)}>
                  <MdDelete />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
