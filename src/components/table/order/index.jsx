'use client';
import React from 'react';
import PropTypes from 'prop-types';
import "./tableStyles.css"
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
    <table className="custom-table">
  <tbody>
    <tr className="body-row">
      {/* <td colSpan="5"></td> */}
      <td colSpan="0" style={{ textAlign: 'left' }}>
        {isLoading ? (
          <div className="skeleton-text" style={{ width: 100, height: 16, background: '#e0e0e0' }} />
        ) : (
          <strong>Subtotal</strong>
        )}
      </td>
      <td style={{ textAlign: 'right' }}>
        {isLoading ? (
          <div className="skeleton-text" style={{ width: 100, height: 16, background: '#e0e0e0' }} />
        ) : (
          <strong>{fCurrency(cCurrency(data?.subTotal))}</strong>
        )}
      </td>
    </tr>

    {checkoutType === 'physical-product' && (
      <tr className="body-row">
        {/* <td colSpan="5"></td> */}
        <td colSpan="0" style={{ textAlign: 'left' }}>
          {isLoading ? (
            <div className="skeleton-text" style={{ width: 100, height: 16, background: '#e0e0e0' }} />
          ) : (
            <strong>Shipping Fee</strong>
          )}
        </td>
        <td style={{ textAlign: 'right' }}>
          {isLoading ? (
            <div className="skeleton-text" style={{ width: 100, height: 16, background: '#e0e0e0' }} />
          ) : (
            <strong>{fCurrency(cCurrency(data?.shipping))}</strong>
          )}
        </td>
      </tr>
    )}
  </tbody>
</table>

    </RootStyled>
  );
}
