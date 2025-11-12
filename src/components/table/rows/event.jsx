import React from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import { useRouter } from 'next-nprogress-bar';
import { useMutation } from 'react-query';
import * as api from 'src/services';

// mui
import { styled } from '@mui/material/styles';
import { Box, TableRow, Skeleton, TableCell, Typography, Stack, IconButton, Tooltip, useTheme } from '@mui/material';

// components
import BlurImage from 'src/components/blurImage';

// utils
import { fDateShort } from 'src/utils/formatTime';

// icons
import { MdEdit, MdDelete, MdCheck, MdClose } from 'react-icons/md';

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

export default function BrandsRow({ isLoading, row, handleClickOpen, sn }) {
  const router = useRouter();
  const theme = useTheme();

  // Mutation to toggle active status
  const { mutate: toggleActive } = useMutation(
    ({ slug, activeStatus }) => api.updateEventActiveStatus({ slug, activeStatus }),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        // Optionally trigger refetch or update cache
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to update active status');
      }
    }
  );

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
            <Skeleton variant="rectangular" width={50} height={50} sx={{ borderRadius: 1 }} />
          ) : (
            <ThumbImgStyle>
              <BlurImage
                priority
                fill
                alt={row?.title}
                src={row?.image?.url}
                placeholder="blur"
                blurDataURL={row?.image.blurDataURL}
              />
            </ThumbImgStyle>
          )}
          <Typography variant="subtitle2" noWrap>
            {isLoading ? <Skeleton variant="text" width={120} sx={{ ml: 1 }} /> : row?.title}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : capitalize(row?.type)}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : capitalize(row?.startTime)}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : capitalize(row?.endTime)}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : capitalize(row?.status)}</TableCell>

      {/* Active Status */}
      <TableCell align="center">
        {isLoading ? (
          <Skeleton variant="rectangular" width={24} height={24} />
        ) : (
          <IconButton
            size="small"
            sx={{
              width: 28,
              height: 28,
              bgcolor: row.activeStatus ? 'green' : 'red',
              '&:hover': { bgcolor: row.activeStatus ? '#2e7d32' : '#c62828' },
              color: 'white'
            }}
            onClick={() => toggleActive({ slug: row.slug, activeStatus: !row.activeStatus })}
          >
            {row.activeStatus ? <MdCheck size={18} /> : <MdClose size={18} />}
          </IconButton>
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
                <IconButton onClick={() => router.push(`/admin/events/${row?.slug}`)}>
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

BrandsRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  sn: PropTypes.number,
  row: PropTypes.shape({
    name: PropTypes.string,
    logo: PropTypes.shape({
      url: PropTypes.string
    }),
    description: PropTypes.string,
    status: PropTypes.string,
    activeStatus: PropTypes.bool,
    createdAt: PropTypes.string,
    slug: PropTypes.string
  }).isRequired,
  handleClickOpen: PropTypes.func.isRequired
};
