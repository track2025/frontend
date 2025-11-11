import { Box, Container, Typography, Grid } from "@mui/material"
import { BlogCard } from "src/components/_main/blog/BlogCard"

export default function BlogsServerPage({ blogPosts, pagination, searchTerm }) {
  const startItem = (pagination.currentPage - 1) * pagination.itemsPerPage + 1
  const endItem = Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)

  return (
    <Box sx={{ minHeight: "100vh", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        <Typography
          component="h1"
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
          component="h2"
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

        {blogPosts.length > 0 && (
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              textAlign: "center",
              mb: 3,
            }}
          >
            {searchTerm
              ? `Found ${pagination.totalItems} result${pagination.totalItems !== 1 ? "s" : ""} for "${searchTerm}"`
              : `Showing ${startItem}-${endItem} of ${pagination.totalItems} blog posts`}
          </Typography>
        )}

        <Grid container spacing={4}>
          {blogPosts.length > 0 ? (
            blogPosts.map((post) => (
              <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={post._id}>
                <BlogCard post={post} />
              </Grid>
            ))
          ) : (
            <Grid item size={12}>
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h5" sx={{ color: "#666", mb: 2 }}>
                  {searchTerm ? "No blog posts found matching your search" : "No blog posts found"}
                </Typography>
                <Typography variant="body1" sx={{ color: "#999" }}>
                  {searchTerm ? "Try adjusting your search terms" : "Check back later for new content!"}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  )
}
