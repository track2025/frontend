import { Box, Container } from "@mui/material"

export default function MegaMenuServer({ categories }) {
  return (
    <Box sx={{ minHeight: "100vh", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        <h1 style={{ fontSize: "2rem", fontWeight: 800, textAlign: "center", marginBottom: "1rem" }}>
          Motorsport Merchandise & Race Wear
        </h1>

        <h2 style={{ fontSize: "1.2rem", fontWeight: 400, textAlign: "center", marginBottom: "3rem", color: "#666" }}>
          Shop high-quality motorsport merchandise, race wear, and track day gear
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.5rem" }}>
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <div key={category._id} style={{ padding: "1.5rem", border: "1px solid #e0e0e0", borderRadius: "8px" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>{category.name}</h3>
                {category.description && <p style={{ fontSize: "0.9rem", color: "#666" }}>{category.description}</p>}
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem" }}>
              <p style={{ fontSize: "1.1rem", color: "#666" }}>No products available at the moment</p>
            </div>
          )}
        </div>
      </Container>
    </Box>
  )
}
