// mui
import { Box, Grid, Stack, Typography } from "@mui/material"
// components
import { ProductCard } from "src/components/cards"

export default async function ProductListServer({ searchQuery, rate }) {
  const api = await import("src/services")

  let data
  try {
    const response = await api.getProducts(searchQuery, "", rate)
    data = response
  } catch (error) {
    console.error("Error fetching products:", error)
    data = null
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <Box sx={{ minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h6" color="text.secondary">
          No products found
        </Typography>
      </Box>
    )
  }

  return (
    <Stack spacing={3} pb={3}>
      <Grid container spacing={2}>
        {data.data.map((product, index) => (
          <Grid item key={product._id || index} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}
