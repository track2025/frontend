'use client';
import React from 'react';
import PropTypes from 'prop-types';

// mui
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  Box,
  Skeleton,
  Stack, 
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
// components
import BlurImage from 'src/components/blurImage';

// custom hooks
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';


// styled
import RootStyled from './styled';

TableDetails.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string.isRequired
        })
      ).isRequired,
      color: PropTypes.string,
      size: PropTypes.string,
      quantity: PropTypes.number,
      priceSale: PropTypes.number,
      price: PropTypes.number
    })
  ).isRequired,
  currency: PropTypes.string,
  conversionRate: PropTypes.number,
  isLoading: PropTypes.bool.isRequired,
  currency: PropTypes.string.isRequired
};

const ThumbImgStyle = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
  border: '1px solid' + theme.palette.divider,
  position: 'relative',
  overflow: 'hidden'
}));
export default function TableDetails({ ...props }) {
  const { data, isLoading, conversionRate, currency } = props;
  const fCurrency = useCurrencyFormatter(currency);
  return (
    <RootStyled>
      <TableContainer>
        <Table className="table-main">
          <TableHead>
            <TableRow className="head-row">
              <TableCell className="head-row-cell">Product</TableCell>
              <TableCell className="head-row-cell active">Download</TableCell>
              <TableCell className="head-row-cell" align="right">
                Price
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(isLoading ? Array.from(new Array(3)) : data)?.map((row, i) => (
              <TableRow key={`row-${i}`}>
                <TableCell>
                  {row ? (
                    <Stack direction="row" spacing={2} alignItems="center">
                      <ThumbImgStyle>
                        <BlurImage priority fill alt={row?.name} src={row?.imageUrl} objectFit="cover" />
                      </ThumbImgStyle>
                      <Stack spacing={0.5}>
                        <Typography variant={'subtitle2'} noWrap fontSize={{ xs: '12px', sm: '0.875rem' }}>
                          {row?.name.slice(0, 50)}
                        </Typography>
                       
                      </Stack>
                    </Stack>
                  ) : (
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Skeleton variant="rectangular" width={64} height={64} />
                      <Skeleton variant="text" width={100} />
                    </Stack>
                  )}
                </TableCell>
                
                <TableCell>{row ? <Button
                                    variant="contained"
                                    color="black"
                                    size="small"
                                    href={`/api/download?fileUrl=${encodeURIComponent(row?.orignalImageUrl)}`}
                                  >
                                    Download Media
                                  </Button>
: <Skeleton variant="text" width={100} />}</TableCell>

                <TableCell align="right">
                  {row ? (
                    `${fCurrency((row?.priceSale || row?.price) * conversionRate)}`
                  ) : (
                    <Skeleton variant="text" width={100} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </RootStyled>
  );
}
