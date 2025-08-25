import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleChangeCurrency } from 'src/redux/slices/settings';
import { useEffect,useRef } from 'react';

// mui
import { Grid, Button, Stack, alpha, Skeleton, Typography, IconButton, DialogContent, Dialog, Topology } from '@mui/material';
import countries from 'src/components/_main/checkout/countries.json';


// icons
import { MdClear } from 'react-icons/md';
import { MdCurrencyExchange } from 'react-icons/md';
import { MdArrowDropDown } from 'react-icons/md';
import { FaExchangeAlt } from 'react-icons/md';


// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
import getLocation from 'src/utils/geolocation';

export default function LanguageSelect() {
  const dispatch = useDispatch();
  const { currency } = useSelector(({ settings }) => settings);
  const [open, setOpen] = React.useState(false);
  const { data, isLoading } = useQuery(['get-currencies'], () => api.getCurrencies());
  const handleClickOpen = () => {
    setOpen(true);
  };



  // Step 2: Function to convert country code to flag emoji
  const getFlagEmoji = (countryCode) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  };

  const getFlagsByCurrency = (currencyCode) => {
    const country = countries?.find(c => c.currency == currencyCode )
    const flag = getFlagEmoji(country?.code)
    return flag
  };


    const autoChangeCurrency = async () => {
      try {
        const currentLocation = await getLocation();
        const selectedCurrency = data?.data?.find(
          (cur) => cur.code === currentLocation?.currency_code
        );
        if (selectedCurrency) {
          return selectedCurrency;
        }
        const usdCurrency = data?.data?.find((cur) => cur.code === 'USD');
        return usdCurrency;
        
      } catch (error) {
        const usdCurrency = data?.data?.find((cur) => cur.code === 'USD');
        return usdCurrency;
      }
    };

    const hasRunRef = useRef(false);


    useEffect(() => {
      // Only run if data exists and hasn't run before
      if (data?.data?.length && !hasRunRef.current) {
        const detectAndSetCurrency = async () => {
          try {
            const currency = await autoChangeCurrency();
            dispatch(handleChangeCurrency({
              currency: currency.code,
              rate: currency.rate || 1
            }));
          } catch (error) {
            const usdCurrency = data?.data?.find((cur) => cur.code === 'USD');
            dispatch(handleChangeCurrency({
              currency: 'USD',
              rate: usdCurrency?.rate || 1
            }));
          } finally {
            hasRunRef.current = true;
          }
        };

        detectAndSetCurrency();
      }
    }, [dispatch, data]);



  

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ marginRight: '-20px' }}>
      
     <IconButton
        aria-label="lang-curr-select"
        onClick={handleClickOpen}
        color="#333"
        sx={{
          marginLeft:-1
        }}
      >
             {getFlagsByCurrency(currency)} <span className="d-none d-md-inline"  style={{ color:'#333', fontSize:"14px", marginRight:0, marginLeft:5}}>{currency}</span>
        <MdArrowDropDown />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 5,
            top: 5,
            zIndex: 111
          }}
        >
          <MdClear />
        </IconButton>
        <DialogContent>
          <Typography variant="h5" mb={2}>
            Choose a currency
          </Typography>
          <Grid container justifyContent="center" spacing={2}>
            {(isLoading ? Array.from(new Array(12)) : data?.data)?.map((cur) => (
              <Grid key={Math.random()} item xs={12} sm={6} md={4}>
                <Button
                  onClick={() => {
                    dispatch(
                      handleChangeCurrency({
                        currency: cur.code,
                        rate: cur.rate
                      })
                    );
                    handleClose()
                  }}
                  fullWidth
                  size="large"
                  variant={'outlined'}
                  color={currency === cur?.code ? 'primary' : 'inherit'}
                  sx={{
                    textAlign: 'left',
                    justifyContent: 'start'
                  }}
                >
                  <Stack>
                    <Typography variant="subtitle2" noWrap>
                      {isLoading ? <Skeleton variant="text" width={120} /> : `${cur.name}-${cur.code}`}
                    </Typography>
                    <Typography variant="body2" noWrap>
                      {isLoading ? <Skeleton variant="text" width={60} /> : cur.country}
                    </Typography>
                  </Stack>
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
}
