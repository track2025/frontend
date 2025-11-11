import Link from "next/link"
import { Box, Container, Grid, Typography, Breadcrumbs, Link as MuiLink, Card, CardContent } from "@mui/material"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import SpeedIcon from "@mui/icons-material/Speed"
import EventIcon from "@mui/icons-material/Event"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"

export default function TrackDetailsServer({ track, upcomingEvents = [] }) {
  const trackName = track.name || "Unknown Track"
  const trackCity = track.city || "Unknown City"
  const trackCountry = track.country || "Unknown Country"
  const trackDescription = track.fullDescription || track.description || "No description available."
  const trackLength = track.length || "N/A"
  const trackCorners = track.corners || "N/A"

  const defaultBannerUrl =
    "https://assets.simpleviewinc.com/simpleview/image/upload/c_fill,f_jpg,h_465,q_65,w_640/v1/crm/virginia/25RIC2CJ_07968_DC74D7F8-03B1-4525-AEB8CE9364DD4AFA_2f960371-6458-4eac-8ba0591de4c5f106.jpg"
  const bannerImage = track.bannerImage?.url || track.thumbnailImage?.url || defaultBannerUrl
  const logoImage = track.logo?.url || null

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Banner Section */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 300, sm: 400, md: 500 },
          overflow: "hidden",
          mt: 0,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 20,
            zIndex: 100,
          }}
        >
          <Container maxWidth="xl" sx={{ pt: 3 }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
              <MuiLink underline="hover" color="#bbb" href="/" sx={{ cursor: "pointer" }}>
                Home
              </MuiLink>
              <MuiLink underline="hover" color="#bbb" href="/tracks" sx={{ cursor: "pointer" }}>
                Tracks
              </MuiLink>
              <Typography color="#fff">{trackName}</Typography>
            </Breadcrumbs>
          </Container>
        </Box>

        <Box
          component="img"
          src={bannerImage}
          alt={`${trackName} - ${trackCity}, ${trackCountry}`}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.8,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.8) 100%)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 2,
          }}
        >
          {logoImage && (
            <Box
              sx={{
                width: { xs: 100, sm: 120, md: 140 },
                height: { xs: 100, sm: 120, md: 140 },
                margin: "0 auto 20px",
                bgcolor: "white",
                borderRadius: "50%",
                p: 2,
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={logoImage}
                alt={`${trackName} logo`}
                sx={{
                  width: "85%",
                  height: "85%",
                  objectFit: "contain",
                }}
              />
            </Box>
          )}

          <Typography
            variant="h1"
            sx={{
              color: "white",
              fontWeight: 800,
              fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              mb: 1,
            }}
          >
            {trackName}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOnIcon sx={{ color: "white", fontSize: 20 }} />
              <Typography sx={{ color: "white", fontSize: "1.1rem" }}>
                {trackCity}, {trackCountry}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <SpeedIcon sx={{ color: "white", fontSize: 20 }} />
              <Typography sx={{ color: "white", fontSize: "1.1rem" }}>
                {trackLength} • {trackCorners} Corners
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: { xs: 7, md: 6 }, px: { xs: 4, md: 7 } }}>
        {/* Description */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "1.5rem", md: "1.75rem" },
              fontWeight: 700,
              mb: 2,
            }}
          >
            About {trackName}
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              lineHeight: 1.7,
              mb: 2,
              whiteSpace: "pre-line",
            }}
          >
            {trackDescription}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item size={{ xs: 12, lg: 8 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                mb: 2,
              }}
            >
              {trackName} Track Day Photos & Gallery
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Browse our extensive collection of track day photos from {trackName}.
            </Typography>
          </Grid>

          <Grid item size={{ xs: 12, lg: 4 }}>
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: 2,
                border: "1px solid #e0e0e0",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                  <EventIcon sx={{ color: "#EE1E50", fontSize: 28 }} />
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.25rem",
                    }}
                  >
                    Upcoming Events
                  </Typography>
                </Box>

                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event, index) => (
                    <Box key={event._id || index} sx={{ mb: index < upcomingEvents.length - 1 ? 2 : 0 }}>
                      <Box
                        component={Link}
                        href={`/tracks/${track.slug}/events/${event.slug}`}
                        sx={{
                          display: "block",
                          py: 2,
                          px: 1,
                          textDecoration: "none",
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                            fontSize: "1rem",
                            lineHeight: 1.3,
                          }}
                        >
                          {event.title || "Upcoming Event"}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CalendarTodayIcon sx={{ fontSize: 16 }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {event.date ? formatDate(event.date) : "Date TBA"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ textAlign: "center", py: 3 }}>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      No upcoming events scheduled
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
