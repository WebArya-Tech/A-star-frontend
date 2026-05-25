import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  itemsPerPage, 
  alwaysShow = false 
}) => {
  if (!alwaysShow && totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-100">
      <div className="text-sm text-gray-500 order-2 sm:order-1">
        Showing <span className="font-semibold text-gray-900">{Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)}</span> to{' '}
        <span className="font-semibold text-gray-900">{Math.min(totalItems, currentPage * itemsPerPage)}</span> of{' '}
        <span className="font-semibold text-gray-900">{totalItems}</span> entries
      </div>
      
      <div className="flex items-center gap-2 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium transition-all hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          Previous
        </button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                  currentPage === pageNum
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium transition-all hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
