import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { TfiWorld } from 'react-icons/tfi';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { MdClear } from 'react-icons/md';
import Typography from '@mui/material/Typography';
import { Grid, Button, Stack, alpha } from '@mui/material';

export default function LanguageSelect() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <IconButton
        aria-label="lang-curr-select"
        onClick={handleClickOpen}
        color="primary"
        sx={{
          borderColor: 'primary',
          borderWidth: 1,
          borderStyle: 'solid',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2)
        }}
      >
        <TfiWorld />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
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
            top: 5
          }}
        >
          <MdClear />
        </IconButton>
        <DialogContent>
          <Box sx={{ width: '100%' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label="language and region" value="1" />
                  <Tab label="currency" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <Typography variant="h5" mb={2}>
                  Choose a language and region
                </Typography>
                <Grid container spacing={2}>
                  {Array.from(new Array(12)).map((idx, index) => (
                    <Grid key={idx} item xs={12} md={3}>
                      <Button
                        fullWidth
                        size="large"
                        variant={index < 1 ? 'outlined' : 'text'}
                        color={index < 1 ? 'primary' : 'inherit'}
                        sx={{
                          textAlign: 'left',
                          justifyContent: 'start'
                        }}
                      >
                        <Stack>
                          <Typography variant="subtitle2">English</Typography>
                          <Typography variant="body2">United States</Typography>
                        </Stack>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>
              <TabPanel value="2">
                <Typography variant="h5" mb={2}>
                  Choose a currency
                </Typography>
                <Grid container spacing={2}>
                  {Array.from(new Array(12)).map((idx, index) => (
                    <Grid key={idx} item xs={12} md={3}>
                      <Button
                        fullWidth
                        size="large"
                        variant={index < 1 ? 'outlined' : 'text'}
                        color={index < 1 ? 'primary' : 'inherit'}
                        sx={{
                          textAlign: 'left',
                          justifyContent: 'start'
                        }}
                      >
                        <Stack>
                          <Typography variant="subtitle2">United States Dollar</Typography>
                          <Typography variant="body2">USD-$</Typography>
                        </Stack>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>
            </TabContext>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
