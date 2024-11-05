import React from "react";
import { Pagination } from "react-bootstrap";
import "./css/Pagination.css";

const PaginationComponent = ({
  currentPage,
  totalPages,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPage,
}) => {
  const pageLimit = 2; // Jumlah halaman tetap di awal dan akhir

  const paginationItems = [];

  // Halaman awal
  for (let i = 1; i <= pageLimit && i <= totalPages; i++) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => onPageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  // Elipsis di awal (jika currentPage lebih jauh dari batas awal yang ditentukan)
  if (currentPage > pageLimit + 2) {
    paginationItems.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
  }

  // Halaman sekitar currentPage, hindari batas dengan halaman awal dan akhir
  for (
    let i = Math.max(pageLimit + 1, currentPage - 1);
    i <= Math.min(currentPage + 1, totalPages - pageLimit);
    i++
  ) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => onPageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  // Elipsis di akhir (jika currentPage lebih jauh dari batas akhir yang ditentukan)
  if (currentPage < totalPages - pageLimit - 1) {
    paginationItems.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
  }

  // Halaman akhir
  for (let i = totalPages - pageLimit + 1; i <= totalPages; i++) {
    if (i > pageLimit) {
      // Pastikan tidak ada duplikasi dengan halaman sebelumnya
      paginationItems.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
  }

  return (
    <div className="pagination-container">
      <div className="items-per-page">
        <label htmlFor="itemsPerPage">Items per page</label>
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
        <Pagination.First
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {paginationItems}
        <Pagination.Next
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  );
};

export default PaginationComponent;
