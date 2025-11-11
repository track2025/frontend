import Link from "next/link"
import Image from "next/image"

// mui
import { Box, Card, Grid, Stack, Typography, Button, Container } from "@mui/material"
// images
import banner1Img from "../../../../../public/images/your-can-lapsnaps.webp"
import banner2Img from "../../../../../public/images/photographer.png"

export default function Index() {
  return (
    <Box mb={2} mt={2}>
      <Container maxWidth="xl">
        <Grid container className="row d-md-flex">
          <Grid item xl={12} lg={6} md={6} xs={12} sm={6} className="col-md-6 mb-3 mb-md-0">
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: "12px",
                height: "100%",
                px: { lg: 3, md: 1 },
                position: "relative",
              }}
            >
              <Image
                draggable="false"
                src={banner1Img || "/placeholder.svg"}
                alt="banner-1"
                placeholder="blur"
                fill
                sizes="100vw"
                style={{ objectFit: "cover" }}
              />
              <Stack spacing={2} sx={{ p: { sm: "24px", xs: "12px" }, zIndex: 99, position: "relative" }}>
                <Typography
                  variant={"h2"}
                  lineHeight={1.3}
                  sx={{
                    color: "#ffffff",
                    width: {
                      xl: "320px !important",
                      lg: "300px !important",
                      md: "220px !important",
                      xs: "170px !important",
                    },
                    fontSize: {
                      xl: 38,
                      lg: 38,
                      md: 28,
                      sm: 20,
                      xs: 20,
                    },
                    whiteSpace: "pre-line",
                  }}
                  component="div"
                >
                  Your Car's{"\n"}Perfect Shot
                </Typography>

                <Typography
                  variant={"h3"}
                  mb={2}
                  display={{ md: "block", xs: "none" }}
                  width={{ xl: 270, md: 270 }}
                  sx={{
                    color: "#ffffff",
                    fontSize: {
                      xl: 12,
                      lg: 12,
                      md: 12,
                      sm: 12,
                      xs: 12,
                    },
                    fontWeight: "400",
                  }}
                >
                  Discover high-quality photographs of vehicles from professional photographers worldwide.
                </Typography>
                <Box>
                  <Button
                    component={Link}
                    href="/race-track/collection"
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: "#ffffff",
                      color: "#000000",
                      borderRadius: 6,
                      textTransform: "none",
                      transition: "background-color 0.3s ease",
                      "&:hover": {
                        bgcolor: "#f0f0f0",
                      },
                    }}
                  >
                    View Collection
                  </Button>
                </Box>
              </Stack>
            </Card>
          </Grid>
          {/* card 2  */}
          <Grid item lg={6} md={6} xs={12} sm={6} className="col-md-6 mb-3 mb-md-0">
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: "12px",
                height: "100%",
                px: { lg: 3, md: 1 },
                position: "relative",
              }}
            >
              <Image
                draggable="false"
                src={banner2Img || "/placeholder.svg"}
                alt="banner-2"
                placeholder="blur"
                fill
                sizes="100vw"
                style={{ objectFit: "cover" }}
              />
              {/* Left Content */}
              <Stack spacing={1.5} sx={{ p: { sm: "24px", xs: "12px" }, zIndex: 1, flex: 0 }}>
                <Typography
                  variant={"h2"}
                  lineHeight={1.3}
                  sx={{
                    width: {
                      xl: "320px !important",
                      lg: "300px !important",
                      md: "220px !important",
                      xs: "170px !important",
                    },
                    fontSize: {
                      xl: 38,
                      lg: 38,
                      md: 28,
                      sm: 20,
                      xs: 20,
                    },
                    color: "#fff",
                  }}
                >
                  Are you a Photographer?
                </Typography>

                <Typography
                  variant={"h3"}
                  mb={2}
                  display={{ md: "block", xs: "none" }}
                  width={{ xl: 270 }}
                  color="#fff"
                  sx={{
                    color: "#ffffff",
                    fontSize: {
                      xl: 12,
                      lg: 12,
                      md: 12,
                      sm: 12,
                      xs: 12,
                    },
                    fontWeight: "400",
                  }}
                >
                  Sell your car photos with ease. Upload, manage, and track your sales — all in one place.
                </Typography>

                <Box>
                  <Button
                    component={Link}
                    href={"/create-shop"}
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: "#000000",
                      color: "#ffffff",
                      borderRadius: 6,
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "#1a1a1a",
                        opacity: 0.9,
                      },
                    }}
                  >
                    Start Selling Now
                  </Button>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
