import { Typography, Box, Container, Grid } from "@mui/material"
import { TrackCardCompact } from "src/components/_main/track/TrackCardCompact"

export default function TracksServerPage({ tracks, pagination, searchTerm }) {
  const startItem = (pagination.currentPage - 1) * pagination.itemsPerPage + 1
  const endItem = Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)

  return (
    <Box sx={{ minHeight: "100vh", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        <Typography
          component="h1"
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
          component="h2"
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
          {searchTerm && ` for "${searchTerm}"`}
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          {tracks.length > 0 ? (
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
      </Container>
    </Box>
  )
}
