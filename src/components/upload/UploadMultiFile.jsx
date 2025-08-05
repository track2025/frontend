import React from 'react';
import PropTypes from 'prop-types';

// mui
import { alpha, styled } from '@mui/material/styles';
import { Box, List, Stack, Paper, Button, ListItem, Typography, Skeleton, IconButton, Backdrop, CircularProgress } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

// components
import { varFadeInRight } from '../animate';

// react dropzone
import { useDropzone } from 'react-dropzone';

const DropZoneStyle = styled('div')(({ theme }) => ({
  outline: 'none',
  display: 'flex',
  textAlign: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  border: `1px dashed ${theme.palette.divider}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
  [theme.breakpoints.up('md')]: { textAlign: 'left', flexDirection: 'row' }
}));

// ----------------------------

UploadMultiFile.propTypes = {
  error: PropTypes.bool,
  files: PropTypes.array,
  onRemove: PropTypes.func,
  onRemoveAll: PropTypes.func,
  sx: PropTypes.object,
  blob: PropTypes.array.isRequired,
  isInitialized: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  isUploading: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]) // Add this prop
};

export default function UploadMultiFile({ ...props }) {
  const { error, files, onRemove, blob, isEdit, onRemoveAll, loading, isUploading, sx, ...other } = props;
  const hasFile = files.length > 0;
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    ...other,
    disabled: !!isUploading // Disable dropzone when uploading
  });

  return (
    <Box sx={{ width: '100%', position: 'relative', ...sx }}>
      {/* Loading overlay */}
      {isUploading && (
        <Backdrop
          open={true}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 1,
          }}
        >
          <CircularProgress color="inherit" />
          {typeof isUploading === 'number' && (
            <Typography variant="body2" sx={{ mt: 2, color: 'common.white' }}>
              Uploading ..
            </Typography>
          )}
        </Backdrop>
      )}

      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter'
          }),
          ...(isUploading && { pointerEvents: 'none' }) // Disable pointer events when uploading
        }}
      >
        <input {...getInputProps()} disabled={loading || isUploading} />
        <Box sx={{ p: 3, ml: { md: 2 } }}>
          <Typography gutterBottom variant="h5">
            Drop or Select Images
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Drop images here or click through your machine.
            {isUploading && (
              <Typography component="span" variant="body2" sx={{ display: 'block', mt: 1, color: 'text.primary' }}>
                Upload in progress...
              </Typography>
            )}
          </Typography>
        </Box>
      </DropZoneStyle>

      <List disablePadding sx={{ ...(hasFile && { my: 3 }) }}>
        {(loading ? [...Array(isEdit ? files.length + blob.length : blob.length)] : files).map((file, i) => (
          <React.Fragment key={'image' + i}>
            {loading ? (
              <ListItem
                {...varFadeInRight}
                sx={{
                  my: 1,
                  p: 0,
                  width: 80,
                  height: 80,
                  borderRadius: 1,
                  display: 'inline-flex',
                  mx: 0.5,
                  border: (theme) => `solid 1px ${theme.palette.divider}`
                }}
              >
                <Skeleton variant="rectangular" width={'100%'} height={'100%'} />
              </ListItem>
            ) : (
              <ListItem
                {...varFadeInRight}
                sx={{
                  p: 0,
                  m: 0.5,
                  width: 80,
                  height: 80,
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'inline-flex'
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => onRemove(file)}
                  sx={{
                    p: '2px',
                    color: 'common.white',
                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48)
                    },
                    top: 6,
                    right: 6,
                    position: 'absolute',
                    zIndex: 22222
                  }}
                >
                  <CloseRoundedIcon fontSize="small" />
                </IconButton>
                <Paper
                  variant="outlined"
                  component="img"
                  src={!file.blob ? file.url : file.blob}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute'
                  }}
                />
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>

      {hasFile && (
        <Stack direction="row" justifyContent="flex-end">
          {loading ? (
            <Skeleton variant="rectangular" width={106} height={36} sx={{ mr: 1.5 }} />
          ) : (
            <Button 
              variant="contained" 
              onClick={onRemoveAll} 
              sx={{ mr: 1.5 }}
              disabled={!!isUploading} // Disable button when uploading
            >
              Remove All
            </Button>
          )}
        </Stack>
      )}
    </Box>
  );
}