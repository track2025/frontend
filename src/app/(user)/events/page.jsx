import Link from "next/link"
import { Box, Container, Typography, Grid, Card, CardActionArea, CardContent } from "@mui/material"
import { getSuperEvents } from "src/services"
import { getCountryFlag } from "src/utils/flags"
import EventCardImage from "src/components/_main/events/EventCardImage"

export const metadata = {
  title: "Motorsport Events & Track Days Worldwide | LapSnaps",
  description:
    "Browse upcoming car & bike motorsport events by country. Find track days, racing events, and motorsport photography opportunities worldwide.",
  keywords:
    "motorsport events, track days, racing events, car events, bike events, motorsport calendar, track day calendar, racing calendar worldwide",
  openGraph: {
    title: "Motorsport Events & Track Days Worldwide | LapSnaps",
    description: "Browse upcoming car & bike motorsport events by country.",
    url: "https://lapsnaps.com/events",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Motorsport Events & Track Days Worldwide | LapSnaps",
    description: "Browse upcoming car & bike motorsport events by country.",
  },
  alternates: {
    canonical: "https://lapsnaps.com/events",
  },
}

export const dynamic = "force-dynamic"

export default async function EventsPage() {
  const eventsData = await getSuperEvents()

  // Get today's date at start of day for accurate comparison
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const countriesMap = {}

  eventsData.forEach((event) => {
    if (!countriesMap[event.countrySlug]) {
      countriesMap[event.countrySlug] = {
        slug: event.countrySlug,
        name: event.country,
        countryCode: event.countryCode,
        eventCount: 0,
        upcomingEvents: 0,
        featuredEvents: [],
      }
    }

    countriesMap[event.countrySlug].eventCount++

    const eventDate = new Date(event.date)
    eventDate.setHours(0, 0, 0, 0)

    if (eventDate >= today) {
      countriesMap[event.countrySlug].upcomingEvents++

      if (event.featured && countriesMap[event.countrySlug].featuredEvents.length < 2) {
        countriesMap[event.countrySlug].featuredEvents.push({
          title: event.title,
          date: event.date,
          trackName: event.trackName,
          type: event.type,
          image: event.image,
        })
      }
    }
  })

  const countriesData = Object.values(countriesMap)

  const sortedCountries = [...countriesData].sort((a, b) => {
    if (b.upcomingEvents !== a.upcomingEvents) {
      return b.upcomingEvents - a.upcomingEvents
    }
    return b.eventCount - a.eventCount
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Motorsport Events & Track Days Worldwide",
    description:
      "Browse upcoming car & bike motorsport events by country. Find track days, racing events, and motorsport photography opportunities worldwide.",
    url: "https://lapsnaps.com/events",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: sortedCountries.map((country, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Place",
          name: country.name,
          url: `https://lapsnaps.com/events/${country.slug}`,
          description: `${country.upcomingEvents} upcoming motorsport events in ${country.name}`,
        },
      })),
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://lapsnaps.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Events",
        item: "https://lapsnaps.com/events",
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Box sx={{ minHeight: "100vh", py: { xs: 4, md: 6 } }}>
        <Container maxWidth="xl">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "1.3rem", sm: "1.6rem", md: "2rem" },
              fontWeight: 800,
              textAlign: "center",
              mb: 2,
            }}
          >
            Upcoming Car & Bike Motorsport Events by Country
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
            Discover {eventsData.filter((event) => new Date(event.date) >= today).length} upcoming events across{" "}
            {sortedCountries.length} countries
          </Typography>

          <Grid container spacing={3}>
            {sortedCountries.map((country, index) => (
              <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={country.slug}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    overflow: "visible",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 32px rgba(238, 30, 80, 0.2)",
                    },
                  }}
                >
                  {index < 3 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                        bgcolor: index === 0 ? "#FFD700" : index === 1 ? "#C0C0C0" : "#CD7F32",
                        color: "white",
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        zIndex: 1,
                        border: "3px solid white",
                      }}
                    >
                      #{index + 1}
                    </Box>
                  )}
                  <CardActionArea component={Link} href={`/events/${country.slug}`} sx={{ height: "100%", p: 3 }}>
                    <CardContent sx={{ textAlign: "center", p: 0 }}>
                      <Typography
                        sx={{
                          fontSize: "4rem",
                          mb: 2,
                          lineHeight: 1,
                        }}
                      >
                        {getCountryFlag(country.countryCode)}
                      </Typography>

                      <Typography
                        variant="h3"
                        sx={{
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          mb: 2,
                        }}
                      >
                        {country.name}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 3,
                          mb: country.featuredEvents.length > 0 ? 2 : 0,
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "1.5rem",
                              fontWeight: 700,
                              color: "#EE1E50",
                            }}
                          >
                            {country.upcomingEvents}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "0.85rem",
                            }}
                          >
                            Upcoming
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "1.5rem",
                              fontWeight: 700,
                            }}
                          >
                            {country.eventCount}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "0.85rem",
                            }}
                          >
                            Total
                          </Typography>
                        </Box>
                      </Box>

                      {index <= 2 && (
                        <>
                          {country.featuredEvents.length > 0 && (
                            <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #f0f0f0" }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  mb: 1,
                                  fontSize: "0.8rem",
                                }}
                              >
                                Featured Events:
                              </Typography>
                              {country.featuredEvents.map((featuredEvent, eventIndex) => {
                                return (
                                  <Box
                                    key={eventIndex}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      mb: 1,
                                      p: 1,
                                      borderRadius: 1,
                                      "&:last-child": {
                                        mb: 0,
                                      },
                                    }}
                                  >
                                    <EventCardImage imageUrl={featuredEvent.image.url} />
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 600,
                                          fontSize: "0.75rem",
                                          lineHeight: 1.2,
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                          textAlign: "left",
                                        }}
                                      >
                                        {featuredEvent.title}
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          lineHeight: 1.2,
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                          textAlign: "left",
                                          fontSize: "0.7rem",
                                          marginTop: 0.5,
                                        }}
                                      >
                                        {formatDate(featuredEvent.date)} • {featuredEvent.trackName}
                                      </Typography>
                                    </Box>
                                  </Box>
                                )
                              })}
                            </Box>
                          )}
                        </>
                      )}

                      {country.upcomingEvents === 0 && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #f0f0f0" }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#999",
                              fontStyle: "italic",
                              fontSize: "0.8rem",
                            }}
                          >
                            No upcoming events
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 6, textAlign: "center" }}>
            <Typography
              variant="body1"
              sx={{
                fontSize: "0.9rem",
              }}
            >
              Showing {sortedCountries.length} countries with {eventsData.length} total events •{" "}
              {eventsData.filter((event) => new Date(event.date) >= today).length} upcoming events
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  )
}
