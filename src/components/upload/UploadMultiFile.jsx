import React from 'react';
import PropTypes from 'prop-types';

// mui
import { alpha, styled } from '@mui/material/styles';
import {
  Box,
  List,
  Stack,
  Paper,
  Button,
  ListItem,
  Typography,
  Skeleton,
  IconButton,
  Backdrop,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

// components
import { varFadeInRight } from '../animate';

// react dropzone
import { useDropzone } from 'react-dropzone';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

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
  loading: PropTypes.bool.isRequired,
  isUploading: PropTypes.bool,
  uploadProgress: PropTypes.number,
  currentFileName: PropTypes.string,
  currentProcess: PropTypes.string
};

export default function UploadMultiFile({ ...props }) {
  const {
    error,
    files,
    onRemove,
    blob,
    onRemoveAll,
    loading,
    isUploading,
    uploadProgress,
    currentFileName,
    currentProcess,
    sx,
    ...other
  } = props;
  const hasFile = files.length > 0;
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/x-msvideo': ['.avi'],
      'video/webm': ['.webm']
    },
    ...other,
    disabled: !!isUploading // Disable dropzone when uploading
  });

  const VIDEO_MIME_TYPES = [
    'video/mp4',
    'application/mp4',
    'video/x-m4v',
    'video/quicktime', // MOV
    'video/x-msvideo', // AVI
    'video/webm',
    'video/x-matroska', // MKV
    'video/ogg'
  ];

  function containsVideoExtension(url) {
    // List of common video file extensions (add more if needed)
    const videoExtensions = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.mkv', '.webm'];

    // Convert url to lowercase to make check case-insensitive
    const lowerUrl = (url || '').toLowerCase();

    // Check if url ends with any of the video extensions
    return videoExtensions.some((ext) => lowerUrl.includes(ext));
  }

  return (
    <Box sx={{ width: '100%', position: 'relative', ...sx }}>
      {/* Upload progress overlay */}
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
            borderRadius: 1
          }}
        >
          <CircularProgress color="inherit" />
          <Typography variant="body2" sx={{ mt: 2, color: 'common.white' }}>
            {currentProcess}: {currentFileName}
          </Typography>
          <Box sx={{ width: '80%', mt: 2 }}>
            <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 10, borderRadius: 5 }} />
            <Typography variant="body2" sx={{ mt: 1, color: 'common.white', textAlign: 'center' }}>
              {Math.round(uploadProgress)}%
            </Typography>
          </Box>
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
          ...(isUploading && { pointerEvents: 'none' })
        }}
      >
        <input {...getInputProps()} disabled={loading || isUploading} />
        <Box sx={{ p: 3, ml: { md: 2 } }}>
          <Typography gutterBottom variant="h5">
            Drop or Select Images/Videos
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Drop files here or click to browse
          </Typography>
        </Box>
      </DropZoneStyle>

      <List disablePadding sx={{ ...(hasFile && { my: 3 }) }}>
        {(loading ? [...Array(blob?.length)] : files).map((file, i) => (
          <React.Fragment key={'file' + i}>
            {loading ? (
              <ListItem
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

                {containsVideoExtension(file?.url) ? (
                  <>
                    <video
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute'
                      }}
                    >
                      <source src={file?.url} type="video/mp4" />
                    </video>
                    <PlayCircleOutlineIcon
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        fontSize: 40,
                        zIndex: 1000
                      }}
                    />
                  </>
                ) : (
                  <Paper
                    variant="outlined"
                    component="img"
                    src={file.url || file.preview}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      position: 'absolute'
                    }}
                  />
                )}
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
