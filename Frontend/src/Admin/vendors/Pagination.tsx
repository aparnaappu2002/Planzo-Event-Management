"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  total: number
  current: number
  setPage: (page: number) => void
}

const Pagination = ({ total, current, setPage }: PaginationProps) => {
  const pages = Array.from({ length: total }, (_, i) => i + 1)

  // Show only a window of pages around the current page
  const getVisiblePages = () => {
    const maxPagesToShow = 5

    if (total <= maxPagesToShow) {
      return pages
    }

    const halfWindow = Math.floor(maxPagesToShow / 2)
    let start = Math.max(current - halfWindow, 1)
    const end = Math.min(start + maxPagesToShow - 1, total)

    if (end - start + 1 < maxPagesToShow) {
      start = Math.max(end - maxPagesToShow + 1, 1)
    }

    return pages.slice(start - 1, end)
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={() => current > 1 && setPage(current - 1)}
        disabled={current === 1}
        className={`p-2 rounded-md ${
          current === 1 ? "text-amber-300 cursor-not-allowed" : "text-amber-600 hover:bg-amber-100"
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {total > 5 && current > 3 && (
        <>
          <button onClick={() => setPage(1)} className="px-3 py-1 rounded-md hover:bg-amber-100 text-amber-800">
            1
          </button>
          {current > 4 && <span className="text-amber-400">...</span>}
        </>
      )}

      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => setPage(page)}
          className={`px-3 py-1 rounded-md ${
            current === page ? "bg-amber-500 text-white font-medium" : "hover:bg-amber-100 text-amber-800"
          }`}
        >
          {page}
        </button>
      ))}

      {total > 5 && current < total - 2 && (
        <>
          {current < total - 3 && <span className="text-amber-400">...</span>}
          <button onClick={() => setPage(total)} className="px-3 py-1 rounded-md hover:bg-amber-100 text-amber-800">
            {total}
          </button>
        </>
      )}

      <button
        onClick={() => current < total && setPage(current + 1)}
        disabled={current === total}
        className={`p-2 rounded-md ${
          current === total ? "text-amber-300 cursor-not-allowed" : "text-amber-600 hover:bg-amber-100"
        }`}
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}

export default Pagination
