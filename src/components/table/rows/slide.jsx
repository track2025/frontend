import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next-nprogress-bar';

// mui
import { styled } from '@mui/material/styles';
import { Box, TableRow, Skeleton, TableCell, Typography, Stack, IconButton, Tooltip } from '@mui/material';

// icons
import { MdCancel, MdCheckCircle, MdEdit, MdDelete } from 'react-icons/md';

// components
import Label from 'src/components/label';
import BlurImage from 'src/components/blurImage';

// utils
import { fDateShort } from 'src/utils/formatTime';

// Styled thumbnail container
// const ThumbImgStyle = styled(Box)(({ theme }) => ({
//   width: 50,
//   height: 50,
//   minWidth: 50,
//   background: theme.palette.background.default,
//   marginRight: theme.spacing(2),
//   border: '1px solid ' + theme.palette.divider,
//   borderRadius: theme.shape.borderRadiusSm,
//   position: 'relative',
//   overflow: 'hidden',
// }));

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
            <></>
            // <ThumbImgStyle>
            //   <BlurImage
            //     alt={row?.title}
            //     src={row?.images?.[0]?.url}
            //     layout="fill"
            //     objectFit="cover"
            //   />
            // </ThumbImgStyle>
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
          <Label
            sx={{
              width: 70,
              fontSize: '0.60rem',
              bgcolor: row?.isActive ? 'success.light' : 'warning.light',
              color: row?.isActive ? 'success.dark' : 'white',
              textTransform: 'capitalize',
            }}
          >
            {row?.isActive ? 'Approved' : 'Draft'}
          </Label>
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
                <IconButton onClick={() => handleClickOpenStatus(row)}>
                  {!row?.isActive ? (
                    <MdCheckCircle color="green" size={23} />
                  ) : (
                    <MdCancel color="orange" size={23} />
                  )}
                </IconButton>
              </Tooltip>

              <Tooltip title="Edit">
                <IconButton onClick={() => router.push(`/admin/slides/${row?.slug}`)}>
                  <MdEdit />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete">
                <IconButton onClick={() => handleClickOpen(row.slug)}>
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
