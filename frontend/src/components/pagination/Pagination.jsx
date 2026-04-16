import React, { useState } from 'react';
import '../../styles/Pagination.css';

const Pagination = ({ currentPage, totalPages, pageSize, onPageChange, onPageSizeChange }) => {
    const [goToPage, setGoToPage] = useState(currentPage);

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handleGoToPage = () => {
        const pageNum = parseInt(goToPage);
        if (pageNum >= 1 && pageNum <= totalPages) {
            onPageChange(pageNum);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        if (startPage > 1) {
            pages.push(
                <button key="1" onClick={() => onPageChange(1)} className="page-btn">
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(<span key="dots-start" className="page-dots">...</span>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`page-btn ${i === currentPage ? 'active' : ''}`}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<span key="dots-end" className="page-dots">...</span>);
            }
            pages.push(
                <button key={totalPages} onClick={() => onPageChange(totalPages)} className="page-btn">
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="pagination-container">
            <div className="pagination-controls">
                <button
                    className="btn btn-secondary"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                >
                    ← Previous
                </button>

                <div className="page-numbers">
                    {renderPageNumbers()}
                </div>

                <button
                    className="btn btn-secondary"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                >
                    Next →
                </button>
            </div>

            <div className="pagination-info">
                <div className="go-to-page">
                    <label>Go to page:</label>
                    <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={goToPage}
                        onChange={(e) => setGoToPage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleGoToPage()}
                    />
                    <button onClick={handleGoToPage}>Go</button>
                </div>

                <div className="page-size">
                    <label>Items per page:</label>
                    <select value={pageSize} onChange={(e) => onPageSizeChange(parseInt(e.target.value))}>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            <div className="page-info">
                Page {currentPage} of {totalPages}
            </div>
        </div>
    );
};

export default Pagination;