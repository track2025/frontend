import React from 'react';
import { Grid, Select, Skeleton, Typography, FormControl, FormHelperText, Stack } from '@mui/material';

import { capitalCase } from 'change-case';
const GENDER_OPTION = ['men', 'women', 'kids', 'others'];

export default function GroupAndCategory(props) {
  const { formik, isVendor, brands, categories, isLoading, options } = props;

  const { values, errors, touched, getFieldProps, setFieldValue } = formik;

  React.useEffect(() => {
    if (values.type === 'variable') {
      setFieldValue('downloadLink', '');
    }
  }, [values.type, setFieldValue]);

  return (
    <Grid container spacing={2}>
      
      <Grid
        size={{
          md: 3,
          xs: 12
        }}
      >
        <FormControl fullWidth>
          <Stack gap={1}>
            {isLoading ? (
              <Skeleton variant="text" width={100} />
            ) : (
              <Typography variant="overline" component="label" htmlFor="grouped-native-select">
                Category
              </Typography>
            )}
            {isLoading ? (
              <Skeleton variant="rounded" width="100%" height={56} />
            ) : (
              <Select native {...getFieldProps('category')} value={values.category} id="grouped-native-select">
                <option value="">None</option>
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            )}
          </Stack>
          {touched.category && errors.category && (
            <FormHelperText error sx={{ px: 2, mx: 0 }}>
              {errors.category}
            </FormHelperText>
          )}
        </FormControl>
      </Grid>
      <Grid
        size={{
          md: 3,
          xs: 12
        }}
      >
        <FormControl fullWidth>
          <Stack gap={1}>
            {isLoading ? (
              <Skeleton variant="text" width={100} />
            ) : (
              <Typography variant="overline" component="label" htmlFor="grouped-native-select-subCategory">
                Sub Category
              </Typography>
            )}
            {isLoading ? (
              <Skeleton variant="rounded" width="100%" height={56} />
            ) : (
              <Select
                native
                {...getFieldProps('subCategory')}
                value={values.subCategory}
                id="grouped-native-select-subCategory"
              >
                <option value="">None</option>
                {categories
                  .find((cat) => cat._id.toString() === values.category)
                  ?.subCategories?.map((subCategory) => (
                    <option key={subCategory._id} value={subCategory._id}>
                      {subCategory.name}
                    </option>
                  ))}
              </Select>
            )}
          </Stack>
          {touched.subCategory && errors.subCategory && (
            <FormHelperText error sx={{ px: 2, mx: 0 }}>
              {errors.subCategory}
            </FormHelperText>
          )}
        </FormControl>
      </Grid>
      <Grid
        size={{
          md: 3,
          xs: 12
        }}
      >
        <FormControl fullWidth>
          <Stack gap={1}>
            {isLoading ? (
              <Skeleton variant="text" width={100} />
            ) : (
              <Typography variant="overline" component="label" htmlFor="brand-name">
                Brand
              </Typography>
            )}
            {isLoading ? (
              <Skeleton variant="rounded" width="100%" height={56} />
            ) : (
              <Select native {...getFieldProps('brand')} value={values.brand} id="brand-name">
                <option value="">None</option>
                {brands?.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </Select>
            )}
          </Stack>
          {touched.brand && errors.brand && (
            <FormHelperText error sx={{ px: 2, mx: 0 }}>
              {errors.brand}
            </FormHelperText>
          )}
        </FormControl>
      </Grid>
      <Grid
        size={{
          md: 3,
          xs: 12
        }}
      >
        <FormControl fullWidth>
          <Stack gap={1}>
            {isLoading ? (
              <Skeleton variant="text" width={80} />
            ) : (
              <Typography variant="overline" component="label" htmlFor="type">
                Product Type
              </Typography>
            )}
            {isLoading ? (
              <Skeleton variant="rounded" width="100%" height={56} />
            ) : (
              <Select
                id="type"
                native
                value={values.type}
                onChange={(e) => setFieldValue('type', e.target.value)}
                error={Boolean(touched.type && errors.type)}
              >
                <option value="" style={{ display: 'none' }} />
                {['simple', 'variable'].map((type) => (
                  <option key={type} value={type}>
                    {capitalCase(type)}
                  </option>
                ))}
              </Select>
            )}
          </Stack>
          {touched.type && errors.type && (
            <FormHelperText error sx={{ px: 2, mx: 0 }}>
              {errors.type}
            </FormHelperText>
          )}
        </FormControl>
      </Grid>
      <Grid
        size={{
          md: isVendor ? 4 : 3,
          xs: 12
        }}
      >
        <FormControl fullWidth>
          <Stack gap={1}>
            {isLoading ? (
              <Skeleton variant="text" width={80} />
            ) : (
              <Typography variant="overline" component="label" htmlFor="delivery-type">
                Delivery Type
              </Typography>
            )}
            {isLoading ? (
              <Skeleton variant="rounded" width="100%" height={56} />
            ) : (
              <Select id="delivery-type" native {...getFieldProps('deliveryType')}>
                <option value="" style={{ display: 'none' }} />
                {[
                  {
                    name: 'Physical',
                    value: 'physical'
                  },
                  {
                    name: 'Digital',
                    value: 'digital'
                  }
                ].map((type) => (
                  <option key={type.name} value={type.value}>
                    {type.name}
                  </option>
                ))}
              </Select>
            )}
          </Stack>
        </FormControl>
      </Grid>
      <Grid
        size={{
          md: isVendor ? 4 : 3,
          xs: 12
        }}
      >
        <FormControl fullWidth>
          <Stack gap={1}>
            {isLoading ? (
              <Skeleton variant="text" width={80} />
            ) : (
              <Typography variant="overline" component="label" htmlFor="featured">
                Featured Product
              </Typography>
            )}
            {isLoading ? (
              <Skeleton variant="rounded" width="100%" height={56} />
            ) : (
              <Select
                id="featured"
                native
                {...getFieldProps('isFeatured')}
                error={Boolean(touched.isFeatured && errors.isFeatured)}
              >
                <option value="" style={{ display: 'none' }} />
                {['Yes', 'No'].map((val) => (
                  <option key={val} value={val === 'Yes'}>
                    {val}
                  </option>
                ))}
              </Select>
            )}
          </Stack>
          {touched.isFeatured && errors.isFeatured && (
            <FormHelperText error sx={{ px: 2, mx: 0 }}>
              {errors.isFeatured}
            </FormHelperText>
          )}
        </FormControl>
      </Grid>
      {!isVendor && (
        <Grid
          size={{
            md: 3,
            xs: 12
          }}
        >
          <FormControl fullWidth>
            <Stack gap={1}>
              {isLoading ? (
                <Skeleton variant="text" width={80} />
              ) : (
                <Typography variant="overline" component="label" htmlFor="status">
                  Status
                </Typography>
              )}
              {isLoading ? (
                <Skeleton variant="rounded" width="100%" height={56} />
              ) : (
                <Select
                  id="status"
                  native
                  {...getFieldProps('status')}
                  error={Boolean(touched.status && errors.status)}
                >
                  {options.map((status) => (
                    <option key={status} value={status}>
                      {capitalCase(status)}
                    </option>
                  ))}
                </Select>
              )}
            </Stack>
            {touched.status && errors.status && (
              <FormHelperText error sx={{ px: 2, mx: 0 }}>
                {errors.status}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
      )}
    </Grid>
  );
}
