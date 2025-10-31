'use client';
import React from 'react';
import PropTypes from 'prop-types';

//  mui
import {
  Typography,
  Skeleton,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  capitalize,
  Box,
  Badge
} from '@mui/material';

// components
import OrderDetailsTable from '../orderDetail';

// custom hooks
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { useCurrencyConvert } from 'src/hooks/convertCurrency';

// styled
import RootStyled from './styled';

TableCard.propTypes = {
  data: PropTypes.shape({
    items: PropTypes.array.isRequired,
    totalItems: PropTypes.number.isRequired,
    subTotal: PropTypes.number.isRequired,
    shipping: PropTypes.number.isRequired,
    discount: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
  }).isRequired,
  isLoading: PropTypes.bool.isRequired
};

export const dynamic = 'force-dynamic';

export default function TableCard({ ...props }) {
  const { data, isLoading } = props;
  const items = data?.items;
  const checkoutType = data?.checkoutType;
  const fCurrency = useCurrencyFormatter();
  const cCurrency = useCurrencyConvert();
  const conversionRate = data?.conversionRate;
  return (
    <RootStyled sx={{ marginBottom: '50px' }}>
      {isLoading ? (
        <Skeleton variant="text" width={100} className="skeleton-h5" />
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5" p={2}>
            {data?.totalItems} {data?.totalItems > 1 ? 'Items' : 'Item'}
          </Typography>
          {checkoutType === 'physical-product' && (
            <Typography variant="h5" p={2}>
              <Badge
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  color: '#fff',
                  bgcolor:
                    data?.status === 'delivered'
                      ? 'success.main'
                      : data?.status === 'failed'
                        ? 'error.main'
                        : 'warning.main'
                }}
              >
                {capitalize(data?.status)}
              </Badge>
            </Typography>
          )}
        </Box>
      )}
      <OrderDetailsTable
        data={items}
        isLoading={isLoading}
        conversionRate={conversionRate}
        currency={data?.currency}
        checkoutType={checkoutType}
      />
      <Divider />
      <Table>
        <TableBody>
          <TableRow className="body-row">
            <TableCell colSpan={4}></TableCell>
            <TableCell align="right">
              {isLoading ? (
                <Skeleton variant="text" className="skeleton-text" width={100} />
              ) : (
                <strong>Subtotal</strong>
              )}
            </TableCell>
            <TableCell align="right">
              {isLoading ? (
                <Skeleton variant="text" className="skeleton-text" width={100} />
              ) : (
                <strong>{fCurrency(cCurrency(data?.subTotal))}</strong>
              )}
            </TableCell>
          </TableRow>

          {checkoutType === 'physical-product' && (
            <TableRow className="body-row">
              <TableCell colSpan={4}></TableCell>
              <TableCell align="right">
                {isLoading ? (
                  <Skeleton variant="text" className="skeleton-text" width={100} />
                ) : (
                  <strong>Shipping Fee</strong>
                )}
              </TableCell>
              <TableCell align="right">
                {isLoading ? (
                  <Skeleton variant="text" className="skeleton-text" width={100} />
                ) : (
                  <strong>{fCurrency(cCurrency(data?.shipping))}</strong>
                )}
              </TableCell>
            </TableRow>
          )}

          {/* <TableRow>
            <TableCell colSpan={4}></TableCell>
            <TableCell align="right">
              {isLoading ? (
                <Skeleton variant="text" className="skeleton-text" width={100} />
              ) : (
                <strong>Shipping Fee</strong>
              )}
            </TableCell>

            <TableCell align="right">
              {isLoading ? (
                <Skeleton variant="text" className="skeleton-text" width={100} />
              ) : (
                <strong>{fCurrency(data?.shipping * conversionRate)}</strong>
              )}
            </TableCell>
          </TableRow> */}
          {/* <TableRow>
            <TableCell colSpan={4}></TableCell>
            <TableCell align="right">
              {isLoading ? (
                <Skeleton variant="text" className="skeleton-text" width={100} />
              ) : (
                <strong>Discount</strong>
              )}
            </TableCell>
            <TableCell align="right">
              {isLoading ? (
                <Skeleton variant="text" className="skeleton-text" width={100} />
              ) : (
                <strong>-{fCurrency(data?.discount * conversionRate)}</strong>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4}></TableCell>
            <TableCell align="right">
              {isLoading ? <Skeleton variant="text" className="skeleton-text" width={100} /> : <strong>Total</strong>}
            </TableCell>
            <TableCell align="right">
              {isLoading ? (
                <Skeleton variant="text" className="skeleton-text" width={100} />
              ) : (
                <strong>{fCurrency(data?.total * conversionRate)}</strong>
              )}
            </TableCell>
          </TableRow> */}
        </TableBody>
      </Table>
    </RootStyled>
  );
}
