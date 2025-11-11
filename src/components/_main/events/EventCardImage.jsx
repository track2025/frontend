"use client"
import { Box } from "@mui/material"

export default function EventCardImage({ imageUrl }) {
  return (
    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: 1,
        overflow: "hidden",
        flexShrink: 0,
        marginRight: 2,
      }}
    >
      <Box
        component="img"
        src={imageUrl}
        alt=""
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          bgcolor: "pink",
        }}
        onError={(e) => {
          e.target.style.display = "none"
          e.target.parentElement.style.background = "linear-gradient(135deg, #EE1E50 0%, #ff6b6b 100%)"
        }}
      />
    </Box>
  )
}
