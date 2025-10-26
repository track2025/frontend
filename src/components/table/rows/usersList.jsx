import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { enUS } from 'date-fns/locale';
import { useRouter } from 'next-nprogress-bar';
import toast from 'react-hot-toast';

// mui
import { styled } from '@mui/material/styles';
import { Box, TableRow, Skeleton, TableCell, Typography, Stack, IconButton, Avatar, Tooltip } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import * as api from 'src/services';

// utils
import { fDateShort } from 'src/utils/formatTime';

// icons
import { FiEye } from 'react-icons/fi';
import { LuUser2 } from 'react-icons/lu';
import { FaUserCheck } from 'react-icons/fa6';
import { FaTrash } from 'react-icons/fa6';

// component
import BlurImage from 'src/components/blurImage';

UserRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    cover: PropTypes.shape({
      url: PropTypes.string.isRequired
    }),
    firstName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    totalOrders: PropTypes.number.isRequired,
    role: PropTypes.string.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired
  }).isRequired,
  setId: PropTypes.func.isRequired
};

const ThumbImgStyle = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  objectFit: 'cover',
  marginRight: theme.spacing(2),
  borderRadius: theme.shape.borderRadiusSm,
  position: 'relative',
  overflow: 'hidden'
}));
export default function UserRow({ isLoading, row, setId, sn }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleDelete = async (slug) => {
    try {
      const response = await api.deleteUserByAdmin(slug); // Your API call

      if (response?.success) {
        toast.success(response.message || 'User deleted successfully.', {
          duration: 3000 // 3 second
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        toast.error(response?.message || 'Failed to delete the user.', {
          duration: 5000
        });
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`, { duration: 5000 });
    } finally {
      setOpen(false); // Close confirmation dialog
    }
  };
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
            <Skeleton variant="circular" width={40} height={40} />
          ) : row?.cover?.url ? (
            <ThumbImgStyle>
              <BlurImage priority fill alt={row?.firstName + ' thumbnail'} src={row?.cover?.url} objectFit="cover" />
            </ThumbImgStyle>
          ) : (
            <Avatar color="primary" sx={{ mr: 1 }}>
              {row?.firstName.slice(0, 1)}
            </Avatar>
          )}
          <Typography variant="subtitle2" noWrap sx={{ textTransform: 'capitalize' }}>
            {isLoading ? <Skeleton variant="text" width={120} sx={{ ml: 1 }} /> : row?.firstName}
          </Typography>
        </Box>
      </TableCell>
      <TableCell style={{ minWidth: 160 }}>{isLoading ? <Skeleton variant="text" /> : row?.email}</TableCell>
      <TableCell style={{ minWidth: 80 }}>{isLoading ? <Skeleton variant="text" /> : row?.phone}</TableCell>
      <TableCell style={{ minWidth: 40 }}>{isLoading ? <Skeleton variant="text" /> : row?.totalOrders || 0}</TableCell>
      <TableCell style={{ minWidth: 40, textTransform: 'capitalize' }}>
        {isLoading ? <Skeleton variant="text" /> : row.role}
      </TableCell>
      <TableCell style={{ minWidth: 40 }}>
        {isLoading ? <Skeleton variant="text" /> : fDateShort(row.createdAt, enUS)}
      </TableCell>
      <TableCell>
        <Stack direction="row" justifyContent="flex-end" gap={1}>
          {isLoading ? (
            <>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="circular" width={40} height={40} />
            </>
          ) : (
            <>
              {row.role === 'super admin' ? (
                <IconButton disabled onClick={() => router.push(`/admin/users/${row?._id}`)}>
                  <FaUserCheck />
                </IconButton>
              ) : (
                <Tooltip title={row.role === 'admin' ? 'Remove an admin' : 'Make an admin'}>
                  <IconButton
                    onClick={() => {
                      setId(row._id);
                    }}
                  >
                    {row.role === 'admin' ? <FaUserCheck /> : <LuUser2 />}
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Preview">
                <IconButton onClick={() => router.push(`/admin/users/${row?._id}`)}>
                  <FiEye />
                </IconButton>
              </Tooltip>

              {(row.role === 'user' || row.role === 'vendor') && (
                <>
                  {/* <IconButton onClick={() => router.push(`/admin/users/${row?._id}`)}>
                    <FaTrash />
                  </IconButton> */}
                  <IconButton size="small" onClick={() => setOpen(true)}>
                    <FaTrash size={16} /> {/* Reduce icon size */}
                  </IconButton>

                  <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Are you sure you want to delete this user? This action cannot be undone.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setOpen(false)}>Cancel</Button>
                      <Button color="error" onClick={() => handleDelete(row?._id)}>
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              )}
            </>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
