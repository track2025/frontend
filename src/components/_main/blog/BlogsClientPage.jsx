"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Box, Container, Typography, Grid, Alert, TextField, InputAdornment, IconButton, Paper } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import ClearIcon from "@mui/icons-material/Clear"
import { getBlogs } from "src/services/blogs"
import { BlogCard } from "src/components/_main/blog/BlogCard"
import { BlogCardSkeleton } from "src/components/_main/blog/BlogCardSkeleton"
import { BlogPagination } from "src/components/_main/blog/BlogPagination"

export default function BlogsClientPage({ initialBlogPosts, initialPagination, initialError, initialSearch }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(initialError)
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [actualSearchTerm, setActualSearchTerm] = useState(initialSearch)
  const [pagination, setPagination] = useState(initialPagination)

  const updateUrl = (page, search) => {
    const params = new URLSearchParams()
    if (page > 1) {
      params.set("page", page.toString())
    }
    if (search) {
      params.set("search", search)
    }
    const newUrl = `/blogs${params.toString() ? `?${params.toString()}` : ""}`
    router.push(newUrl)
  }

  const fetchBlogs = async (page = 1, search = "") => {
    try {
      setLoading(true)
      setError(null)
      const response = await getBlogs({
        limit: pagination.itemsPerPage,
        page: page,
        search: search,
      })

      if (response.success) {
        setBlogPosts(response.data || [])
        setActualSearchTerm(search)
        setPagination((prev) => ({
          ...prev,
          currentPage: response.currentPage || page,
          totalPages: response.count || 1,
          totalItems: response.total || 0,
        }))
      } else {
        setError("Failed to load blog posts")
        setBlogPosts([])
        setActualSearchTerm(search)
      }
    } catch (err) {
      console.error("Error fetching blogs:", err)
      setError(err?.message || "Unable to load blog posts. Please try again later.")
      setBlogPosts([])
      setActualSearchTerm(search)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (event, newPage) => {
    updateUrl(newPage, searchTerm)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSearchSubmit = (event) => {
    if (event) {
      event.preventDefault()
    }
    updateUrl(1, searchTerm)
  }

  const handleClearSearch = () => {
    setSearchTerm("")
    updateUrl(1, "")
  }

  const startItem = (pagination.currentPage - 1) * pagination.itemsPerPage + 1
  const endItem = Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)

  return (
    <Box sx={{ minHeight: "100vh", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.8rem" },
            fontWeight: 800,
            textAlign: "center",
            mb: 2,
          }}
        >
          LapSnaps Blog – Motorsport Photography & Track-Day Insights
        </Typography>

        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
            fontWeight: 400,
            textAlign: "center",
            mb: 6,
            maxWidth: "800px",
            mx: "auto",
          }}
        >
          Expert tips, tutorials, and insights for motorsport photographers and track day enthusiasts
        </Typography>

        <Paper
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            mb: 4,
            maxWidth: 600,
            mx: "auto",
            borderRadius: "28px",
            background: "transparent",
          }}
        >
          <TextField
            fullWidth
            placeholder="Search blog posts..."
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
                borderRadius: "24px",
              },
            }}
          />
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {!loading && blogPosts.length > 0 && pagination.totalPages === 1 && (
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              textAlign: "center",
              mb: 3,
            }}
          >
            {actualSearchTerm
              ? `Found ${pagination.totalItems} result${pagination.totalItems !== 1 ? "s" : ""} for "${actualSearchTerm}"`
              : `Showing ${startItem}-${endItem} of ${pagination.totalItems} blog posts`}
          </Typography>
        )}

        <Grid container spacing={4}>
          {loading ? (
            Array.from(new Array(pagination.itemsPerPage)).map((_, index) => (
              <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={`skeleton-${index}`}>
                <BlogCardSkeleton />
              </Grid>
            ))
          ) : blogPosts.length > 0 ? (
            blogPosts.map((post) => (
              <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={post._id}>
                <BlogCard post={post} />
              </Grid>
            ))
          ) : (
            <Grid item size={12}>
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h5" sx={{ color: "#666", mb: 2 }}>
                  {actualSearchTerm ? "No blog posts found matching your search" : "No blog posts found"}
                </Typography>
                <Typography variant="body1" sx={{ color: "#999" }}>
                  {actualSearchTerm ? "Try adjusting your search terms" : "Check back later for new content!"}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        {!loading && pagination.totalPages > 1 && (
          <BlogPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </Container>
    </Box>
  )
}
