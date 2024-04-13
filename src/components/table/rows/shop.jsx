// mui
import {
  Box,
  TableRow,
  Skeleton,
  TableCell,
  Typography,
  Stack,
  IconButton,
  Rating,
  Tooltip,
  Link
} from '@mui/material';
// redux
import { fCurrency } from 'src/utils/formatNumber';
import { fDateShort } from 'src/utils/formatTime';
// components
import Label from 'src/components/label';
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { IoEye } from 'react-icons/io5';
import { enUS } from 'date-fns/locale';
import { useRouter } from 'next-nprogress-bar';
import BlurImage from 'src/components/blurImage';
import PropTypes from 'prop-types';

// const label = { inputProps: { 'aria-label': 'Switch demo' } };
export default function ProductRow({ isLoading, row, handleClickOpen }) {
  const router = useRouter();
  return (
    <TableRow hover key={Math.random()}>
      <TableCell component="th" scope="row" sx={{ maxWidth: 300 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {isLoading ? (
            <Skeleton variant="rectangular" width={50} height={50} sx={{ borderRadius: 1 }} />
          ) : (
            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                width: 50,
                height: 50,
                bgcolor: 'background.default',
                mr: 2,
                border: (theme) => '1px solid ' + theme.palette.divider,
                borderRadius: '6px',
                img: {
                  borderRadius: '2px'
                }
              }}
            >
              <BlurImage
                alt={row?.name}
                blurDataURL={row?.logo.blurDataURL}
                src={row?.logo.url}
                layout="fill"
                objectFit="cover"
              />
            </Box>
          )}
          <Typography variant="subtitle2" noWrap>
            {isLoading ? <Skeleton variant="text" width={120} sx={{ ml: 1 }} /> : row?.title}
          </Typography>
        </Box>
      </TableCell>
      {/* <TableCell>
          <Skeleton variant="text" />
        </TableCell> */}
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{row.products.length || '-'}</>}</TableCell>
      {/* {fDateShort(row?.createdAt, enUS)} */}
      <TableCell align="left">
        {isLoading ? <Skeleton variant="text" /> : `${row.vendor.firstName} ${row.vendor.lastName}`}
      </TableCell>

      <TableCell>
        {isLoading ? <Skeleton variant="text" /> : row.approved ? fDateShort(row?.approvedAt, enUS) : 'Not approved'}
      </TableCell>
      {/* <TableCell>
          {isLoading ? (
            <Skeleton variant="text" />
          ) : (
            <Switch
              {...label}
              defaultChecked={row.isFeatured}
              onChange={() => {
                mutate({
                  isFeatured: !row.isFeatured,
                  id: row._id,
                });
              }}
            />
          )}
        </TableCell> */}
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Label
            variant="filled"
            sx={{
              bgcolor:
                row?.status === 'pending' ? 'info.light' : row?.status === 'pending' ? 'success.light' : 'error.light',
              color:
                row?.status === 'pending' ? 'info.dark' : row?.status === 'pending' ? 'success.dark' : 'error.dark',
              textTransform: 'capitalize'
            }}
          >
            {row?.status}
          </Label>
        )}
      </TableCell>
      <TableCell align="right">
        {isLoading ? (
          <Stack direction="row" justifyContent="flex-end">
            <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
            <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
            <Skeleton variant="circular" width={34} height={34} />
          </Stack>
        ) : (
          <Stack direction="row" justifyContent="flex-end">
            <Link href={`/admin/shops/${row.slug}`}>
              <IconButton>
                <IoEye />
              </IconButton>
            </Link>
            <Tooltip title="Edit">
              <IconButton onClick={() => router.push(`/admin/shops/edit/${row.slug}`)}>
                <MdEdit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={handleClickOpen(row.slug)}>
                <MdDelete />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </TableCell>
    </TableRow>
  );
}
ProductRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    name: PropTypes.string.isRequired,
    logo: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired
      })
    ).isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
    products: PropTypes.number,
    averageRating: PropTypes.number.isRequired,
    priceSale: PropTypes.number,
    price: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired
  }).isRequired,
  handleClickOpen: PropTypes.func.isRequired
};
