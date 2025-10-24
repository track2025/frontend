import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import moment from 'moment-timezone';

const allTimezones = moment.tz.names().map((tz) => {
  const offset = moment.tz(tz).format('Z');
  return {
    label: `${tz} (GMT${offset})`,
    value: tz
  };
});

export default function TimezoneSearch({ value, onChange, error, helperText }) {
  return (
    <Autocomplete
      fullWidth
      value={allTimezones.find((tz) => tz.value === value) || null}
      options={allTimezones}
      getOptionLabel={(option) => option.label}
      onChange={(e, newValue) => onChange(newValue ? newValue.value : '')}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Timezone"
          error={!!error}
          helperText={helperText}
          placeholder="Search by city, country, or timezone..."
        />
      )}
      filterOptions={(options, { inputValue }) =>
        options.filter((opt) => opt.label.toLowerCase().includes(inputValue.toLowerCase()))
      }
    />
  );
}
