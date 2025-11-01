import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next-nprogress-bar';

// mui
import { styled } from '@mui/material/styles';
import { Box, TableRow, Skeleton, TableCell, Typography, Stack, IconButton, Tooltip } from '@mui/material';

// icons
import { MdCancel, MdCheckCircle, MdEdit, MdDelete } from 'react-icons/md';

// components
// import Label from 'src/components/label';
import BlurImage from 'src/components/blurImage';

// utils
import { fDateShort } from 'src/utils/formatTime';


export default function SlideRow({ isLoading, row, sn, handleClickOpen, handleClickOpenStatus }) {
  const router = useRouter();

  console.log("Row:", row)

  return (
    <TableRow hover key={row?.slug || sn}>
      {/* Serial number */}
      <TableCell>{isLoading ? <Skeleton variant="text" /> : sn}</TableCell>

      {/* Title and thumbnail */}
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isLoading ? (
            <Skeleton variant="rectangular" width={50} height={50} sx={{ borderRadius: 1, mr: 2 }} />
          ) : (
            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                width: 50,
                height: 50,
                bgcolor: 'background.default',
                mr: 2,
                border: '1px solid #666',
                borderRadius: '6px',
                img: {
                  borderRadius: '2px'
                }
              }}
            >
              <BlurImage
                alt={row?.description}
                blurDataURL={row?.images[0].blurDataURL}
                placeholder="blur"
                src={row?.images[0].url}
                layout="fill"
                objectFit="cover"
              />
            </Box>
          )}
          <Typography variant="subtitle2" noWrap>
            {isLoading ? <Skeleton variant="text" width={120} /> : row?.title}
          </Typography>
        </Box>
      </TableCell>

      {/* Button text */}
      <TableCell>{isLoading ? <Skeleton variant="text" /> : row?.buttonText}</TableCell>

      {/* Status label */}
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Typography
            sx={{
              width: 70,
              fontSize: '0.60rem',
              bgcolor: row?.isActive ? 'success.light' : 'warning.light',
              color: row?.isActive ? 'success.dark' : 'white',
              textTransform: 'capitalize',
            }}
          >
            {row?.isActive ? 'Approved' : 'Draft'}
          </Typography>
        )}
      </TableCell>

      {/* Created date */}
      <TableCell>{isLoading ? <Skeleton variant="text" /> : fDateShort(row?.createdAt)}</TableCell>

      {/* Actions */}
      <TableCell align="right">
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          {isLoading ? (
            <>
              <Skeleton variant="circular" width={34} height={34} />
              <Skeleton variant="circular" width={34} height={34} />
            </>
          ) : (
            <>
              <Tooltip title={!row?.isActive ? 'Approve' : 'Draft'}>
                <IconButton onClick={handleClickOpenStatus(row)}>
                  {!row?.isActive ? <MdCheckCircle color="green" size={23} /> : <MdCancel color="orange" size={23} />}
                </IconButton>
              </Tooltip>

              <Tooltip title="Edit">
                <IconButton onClick={() => router.push(`/admin/slides/${row?.slug}`)}>
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

SlideRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  sn: PropTypes.number.isRequired,
  row: PropTypes.shape({
    title: PropTypes.string,
    buttonText: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({ url: PropTypes.string })
    ),
    isActive: PropTypes.bool,
    createdAt: PropTypes.string,
    slug: PropTypes.string,
  }).isRequired,
  handleClickOpen: PropTypes.func.isRequired,
  handleClickOpenStatus: PropTypes.func.isRequired,
};
