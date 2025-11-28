"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Paper, TextField, InputAdornment, IconButton } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import ClearIcon from "@mui/icons-material/Clear"

export default function BlogSearch({ initialSearch }) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState(initialSearch || "")

  const updateUrl = (search) => {
    const params = new URLSearchParams()
    // Reset to page 1 on new search
    if (search) {
      params.set("search", search)
    }
    const newUrl = `/blogs${params.toString() ? `?${params.toString()}` : ""}`
    router.push(newUrl)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSearchSubmit = (event) => {
    if (event) {
      event.preventDefault()
    }
    updateUrl(searchTerm)
  }

  const handleClearSearch = () => {
    setSearchTerm("")
    updateUrl("")
  }

  return (
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
  )
}
