import React from "react";
import { Pagination } from "react-bootstrap";

const PaginationComponent = ({
  currentPage,
  totalPages,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPage,
}) => {
  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <div>
        <label htmlFor="itemsPerPage">Items per page: </label>
        <select
          id="itemsPerPage"
          onChange={onItemsPerPageChange}
          value={itemsPerPage}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={30}>30</option>
        </select>
      </div>

      <Pagination>
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default PaginationComponent;
