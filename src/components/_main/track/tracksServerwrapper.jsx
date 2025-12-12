// src/components/_main/track/TracksServerWrapper.js
'use client'

import { useState, useEffect } from 'react'
import TracksServerPage from './TracksServerPage'
import { CircularProgress, Box } from '@mui/material'

export default function TracksServerWrapper({ tracks, pagination, searchTerm }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return <TracksServerPage tracks={tracks} pagination={pagination} searchTerm={searchTerm} />
}