"use client"

import { useRouter } from "next/navigation"
import { BlogPagination } from "src/components/_main/blog/BlogPagination"

export default function BlogPaginationWithNavigation({ pagination, searchTerm }) {
  const router = useRouter()

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

  const handlePageChange = (event, newPage) => {
    updateUrl(newPage, searchTerm)
  }

  if (pagination.totalPages <= 1) {
    return null
  }

  return (
    <BlogPagination
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      totalItems={pagination.totalItems}
      itemsPerPage={pagination.itemsPerPage}
      onPageChange={handlePageChange}
    />
  )
}
