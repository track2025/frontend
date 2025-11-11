"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Typography, Box, Container, Grid, Alert, TextField, InputAdornment, IconButton } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import ClearIcon from "@mui/icons-material/Clear"
import { getTracks } from "src/services/tracks"
import { TrackCardCompact, TrackCardCompactSkeleton } from "src/components/_main/track/TrackCardCompact"
import { BlogPagination } from "src/components/_main/blog/BlogPagination"

export default function TracksClientPage({ initialTracks, initialPagination, initialError, initialSearch }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tracks, setTracks] = useState(initialTracks)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(initialError)
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [pagination, setPagination] = useState(initialPagination)

  const fetchTracks = async (page = 1, search = "") => {
    try {
      setLoading(true)
      setError(null)
      const response = await getTracks({
        limit: pagination.itemsPerPage,
        page: page,
        search: search,
      })

      if (response.success) {
        setTracks(response.data || [])
        setPagination((prev) => ({
          ...prev,
          currentPage: response.currentPage || page,
          totalPages: response.count || 1,
          totalItems: response.total || 0,
        }))
      } else {
        setError("Failed to load tracks")
        setTracks([])
      }
    } catch (err) {
      console.error("Error fetching tracks:", err)
      setError("Unable to load tracks. Please try again later.")
      setTracks([])
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (event, newPage) => {
    const params = new URLSearchParams()
    if (searchTerm) {
      params.set("search", searchTerm)
    }
    params.set("page", newPage.toString())
    const newUrl = `/tracks${params.toString() ? `?${params.toString()}` : ""}`
    router.push(newUrl)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSearchSubmit = (event) => {
    if (event) {
      event.preventDefault()
    }
    const params = new URLSearchParams()
    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim())
    }
    params.set("page", "1")
    const newUrl = `/tracks${params.toString() ? `?${params.toString()}` : ""}`
    router.push(newUrl)
  }

  const handleClearSearch = () => {
    setSearchTerm("")
    const params = new URLSearchParams()
    params.set("page", "1")
    const newUrl = `/tracks${params.toString() ? `?${params.toString()}` : ""}`
    router.push(newUrl)
  }

  const startItem = (pagination.currentPage - 1) * pagination.itemsPerPage + 1
  const endItem = Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)

  return (
    <Box sx={{ minHeight: "100vh", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "1.4rem", sm: "1.8rem", md: "2.3rem" },
            fontWeight: 800,
            textAlign: "center",
            mb: 1,
          }}
        >
          All Race Tracks on LapSnaps
        </Typography>

        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
            fontWeight: 400,
            color: "#666",
            textAlign: "center",
            mb: 3,
            maxWidth: "800px",
            mx: "auto",
          }}
        >
          Explore Car, Bike & Kart Circuits from Around the World
        </Typography>

        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            maxWidth: 700,
            mx: "auto",
            mb: 4,
          }}
        >
          <TextField
            fullWidth
            placeholder="Search tracks by name, city, or country..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton aria-label="clear search" onClick={handleClearSearch} edge="end" size="small">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 3,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#666",
                },
              },
            }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <Typography
          variant="body2"
          sx={{
            color: "#666",
            textAlign: "center",
            width: "100%",
            mb: 2,
          }}
        >
          Showing {startItem}-{endItem} of {pagination.totalItems} results
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          {loading ? (
            Array.from(new Array(pagination.itemsPerPage)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-${index}`}>
                <TrackCardCompactSkeleton index={index} />
              </Grid>
            ))
          ) : tracks.length > 0 ? (
            tracks.map((track) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={track._id}>
                <TrackCardCompact track={track} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h5" sx={{ color: "#666", mb: 2 }}>
                  {searchTerm ? "No tracks found matching your search" : "No tracks found"}
                </Typography>
                <Typography variant="body1" sx={{ color: "#999" }}>
                  {searchTerm ? "Try adjusting your search terms" : "Check back later for new tracks!"}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        {!loading && pagination.totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <BlogPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={handlePageChange}
            />
          </Box>
        )}
      </Container>
    </Box>
  )
}
