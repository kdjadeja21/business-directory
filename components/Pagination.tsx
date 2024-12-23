"use client";

import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Always show first page
    range.push(1);

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    // Always show last page
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Add dots where needed
    let l;
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <PaginationRoot>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          />
        </PaginationItem>

        {/* Desktop View - Show all page numbers */}
        <div className="hidden sm:flex">
          {getPageNumbers().map((page, index) => (
            <PaginationItem key={index}>
              {page === '...' ? (
                <span className="px-4 py-2 text-sm text-muted-foreground">
                  {page}
                </span>
              ) : (
                <PaginationLink
                  onClick={() => onPageChange(page as number)}
                  isActive={currentPage === page}
                >
                  {(page as number).toString().padStart(2, '0')}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
        </div>

        {/* Mobile View - Show current/total */}
        <div className="sm:hidden">
          <PaginationItem>
            <div className="flex items-center px-4">
              <span className="text-sm font-medium">
                {currentPage.toString().padStart(2, '0')}
              </span>
              <span className="text-sm text-muted-foreground mx-2">of</span>
              <span className="text-sm font-medium">
                {totalPages.toString().padStart(2, '0')}
              </span>
            </div>
          </PaginationItem>
        </div>

        <PaginationItem>
          <PaginationNext 
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}
