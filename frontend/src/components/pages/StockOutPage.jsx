import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStockOuts,
  fetchStockOutDetail,
  updateStockOut,
} from "../../services/stockService";
import debounce from "lodash.debounce";
import StockDetailModal from "../modals/stockDetailModal";
import StockOutTable from "../tables/StockOutTable";
import TableAction from "../TableAction";
import PaginationComponent from "../PaginationComponent";

const StockOutPage = () => {
  const dispatch = useDispatch();
  const stockOuts = useSelector((state) => state.inventory.stockOuts || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedStockOut, setSelectedStockOut] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const handleSearch = useCallback(
    debounce(async (keyword) => {
      await fetchStockOuts(currentPage, itemsPerPage, dispatch, keyword);
    }, 500),
    [currentPage, itemsPerPage, dispatch]
  );

  const sortedStockOuts = React.useMemo(() => {
    if (!stockOuts || !Array.isArray(stockOuts)) return [];
    let sortableStockOuts = [...stockOuts];

    if (sortConfig !== null) {
      sortableStockOuts.sort((a, b) => {
        if (sortConfig.key === "status") {
          // Sorting by status and quantity_remaining
          const statusA = a.quantity_remaining === 0 ? "Empty" : "Ready";
          const statusB = b.quantity_remaining === 0 ? "Empty" : "Ready";

          if (statusA !== statusB) {
            return sortConfig.direction === "ascending"
              ? statusA.localeCompare(statusB)
              : statusB.localeCompare(statusA);
          }
          // If status is the same, sort by quantity_remaining
          return sortConfig.direction === "ascending"
            ? b.quantity_remaining - a.quantity_remaining
            : a.quantity_remaining - b.quantity_remaining;
        } else {
          // Default sorting for other keys
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        }
      });
    }
    return sortableStockOuts;
  }, [stockOuts, sortConfig]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Memanggil all stock-out
  const fetchAndSetStockOuts = useCallback(async () => {
    setLoading(true);
    try {
      const totalPagesFromApi = await fetchStockOuts(
        currentPage,
        itemsPerPage,
        dispatch,
        searchTerm
      );
      setTotalPages(totalPagesFromApi); // Mengatur totalPages dari API
    } catch (err) {
      console.error("Error fetching stock-out", err);
    } finally {
      setLoading(false);
    }
  }, [dispatch, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchAndSetStockOuts();
  }, [fetchAndSetStockOuts]);

  const handleDetailClick = async (stockOut) => {
    const stockOutDetail = await fetchStockOutDetail(stockOut.id);
    setSelectedStockOut(stockOutDetail);
    setShowModal(true);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStockOut(null);
  };

  const handleUpdateClick = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = async (updatedStockData) => {
    try {
      await updateStockOut(selectedStockOut.id, updatedStockData);
      await fetchAndSetStockOuts();
      handleCloseModal(); // Menutup modal dan reset state
    } catch (error) {
      console.error("Error updating stock-out", error);
    }
  };

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="container mt-4">
          <h1 className="mb-4">Stock-out List</h1>
          <TableAction
            onSearch={handleSearch}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <StockOutTable
            stockOuts={sortedStockOuts}
            onDetailClick={handleDetailClick}
            onSort={handleSort}
            sortConfig={sortConfig}
          />
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPage={itemsPerPage}
          />

          <StockDetailModal
            show={showModal}
            onClose={handleCloseModal}
            stockData={selectedStockOut}
            isEditing={isEditing}
            onUpdate={handleSaveChanges}
            onToggleEdit={handleUpdateClick}
            type="stock-out"
          />
        </div>
      )}
    </>
  );
};

export default StockOutPage;