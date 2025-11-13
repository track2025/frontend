import React, { Fragment } from 'react';
import Image from 'next/image';
import { Typography, Stack, Tooltip, Box, Button } from '@mui/material';
import { capitalize } from 'lodash';

export default function PhysicalProductVariantSelection({
  names = [],
  variants = [],
  product,
  selectedVariant,
  onChangeVariant
}) {

  console.log("Variation Names", names);

  return (
<<<<<<< HEAD
    <div style={{ width: '100%', display: 'flex'}}>
=======
    // <div style={{ width: '95%' }}>
    <Box width={'95%'}>
>>>>>>> 2025/11/11/changes-from-docs
      {names.map((name, index) => (
        <div style={{ width: '100%', display: 'grid'}}>
          <Typography variant="subtitle2" color="text.secondary" style={{ textTransform: "uppercase", fontWeight: 'bolder' }}>
            {name}
<<<<<<< HEAD
          </Typography>
  
          <select
            value={(variants[index] || []).find((v) => selectedVariant?.split('/')?.includes(v)) || ''}
            onChange={(e) => onChangeVariant(e.target.value, index)}
            style={{
              width: '95%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              outline: 'none',
              fontSize: '14px',
              textTransform: 'uppercase',
              backgroundColor: '#f4f4f4',
              borderWidth: 0,
              outline: 'none'
            }}
          >
            {[...new Set(variants[index] || [])].map((variant, ind) => (
              <option key={variant} value={variant} style={{ textTransform: "capitalize", fontWeight: 'bolder' }}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </option>
            ))}
          </select>
        </div>
=======
          </Typography> */}

          {names.map((name, index) => (
            <>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                style={{ textTransform: 'uppercase', fontWeight: 'bolder' }}
              >
                {name}
              </Typography>

              <select
                value={(variants[index] || []).find((v) => selectedVariant?.split('/')?.includes(v)) || ''}
                onChange={(e) => onChangeVariant(e.target.value, index)}
                style={{
                  width: '95%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  outline: 'none',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  backgroundColor: '#f4f4f4',
                  borderWidth: 0,
                  outline: 'none'
                }}
              >
                {[...new Set(variants[index] || [])].map((variant, ind) => (
                  <option key={variant} value={variant} style={{ textTransform: 'capitalize', fontWeight: 'bolder' }}>
                    {variant.charAt(0).toUpperCase() + variant.slice(1)}
                  </option>
                ))}
              </select>
            </>
          ))}
        </Fragment>
>>>>>>> 2025/11/11/changes-from-docs
      ))}
    </Box>
  );
}
