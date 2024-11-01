import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStockHistoryDetail,
  fetchStockHistories,
} from "../../services/stockService";
import debounce from "lodash.debounce";
import StockDetailModal from "../modals/stockDetailModal";
import TableAction from "../TableAction";
import PaginationComponent from "../PaginationComponent";
import StockHistoryTable from "../tables/StockHistoryTable";

const StockHistoryPage = () => {
  const dispatch = useDispatch();
  const stockHistories = useSelector(
    (state) => state.inventory.stockHistories || []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedStockHistory, setSelectedStockHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const handleSearch = useCallback(
    debounce(async (keyword) => {
      await fetchStockHistories(currentPage, itemsPerPage, dispatch, keyword);
    }, 500),
    [currentPage, itemsPerPage, dispatch]
  );

  const sortedStockHistories = React.useMemo(() => {
    if (!stockHistories || !Array.isArray(stockHistories)) return [];
    let sortableStockHistories = [...stockHistories];

    if (sortConfig !== null) {
      sortableStockHistories.sort((a, b) => {
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
    return sortableStockHistories;
  }, [stockHistories, sortConfig]);

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

  // Memanggil all stock history
  const fetchAndSetStockHistories = useCallback(async () => {
    setLoading(true);
    try {
      const totalPagesFromApi = await fetchStockHistories(
        currentPage,
        itemsPerPage,
        dispatch,
        searchTerm
      );
      setTotalPages(totalPagesFromApi); // Mengatur totalPages dari API
    } catch (err) {
      console.error("Error fetching stock histories", err);
    } finally {
      setLoading(false);
    }
  }, [dispatch, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchAndSetStockHistories();
  }, [fetchAndSetStockHistories]);

  const handleDetailClick = async (stockHistory) => {
    const stockHistoryDetail = await fetchStockHistoryDetail(stockHistory.id);
    setSelectedStockHistory(stockHistoryDetail);
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
    setSelectedStockHistory(null);
  };

  //   const handleUpdateClick = () => {
  //     setIsEditing(true);
  //   };

  //   const handleSaveChanges = async (updatedStockData) => {
  //     try {
  //       await updateStockOut(selectedStockOut.id, updatedStockData);
  //       await fetchAndSetStockOuts();
  //       handleCloseModal(); // Menutup modal dan reset state
  //     } catch (error) {
  //       console.error("Error updating stock-out", error);
  //     }
  //   };

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="container mt-4">
          <h1 className="mb-4">Stock History List</h1>
          <TableAction
            onSearch={handleSearch}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <StockHistoryTable
            stockHistories={sortedStockHistories}
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
            stockData={selectedStockHistory}
            type="stock-history"
          />
        </div>
      )}
    </>
  );
};

export default StockHistoryPage;
