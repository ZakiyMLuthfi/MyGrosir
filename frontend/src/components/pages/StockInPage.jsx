import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStockIns,
  addStockInService,
  fetchStockInDetail,
} from "../../services/stockService";
import debounce from "lodash.debounce";
import StockDetailModal from "../modals/stockDetailModal";
import StockInTable from "../tables/StockInTable";
import TableAction from "../TableAction";
import PaginationComponent from "../PaginationComponent";

const StockInPage = () => {
  const dispatch = useDispatch();
  const stockIns = useSelector((state) => state.inventory.stockIns || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedStockIn, setSelectedStockIn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const handleSearch = useCallback(
    debounce(async (keyword) => {
      await fetchStockIns(currentPage, itemsPerPage, dispatch, keyword);
    }, 500),
    [currentPage, itemsPerPage, dispatch]
  );

  const sortedStockIns = React.useMemo(() => {
    let sortableStockIns = [...stockIns];
    if (sortConfig !== null) {
      sortableStockIns.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableStockIns;
  }, [stockIns, sortConfig]);

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

  // Memanggil all stock-in
  const fetchAndSetStockIns = useCallback(async () => {
    setLoading(true);
    try {
      const totalPagesFromApi = await fetchStockIns(
        currentPage,
        itemsPerPage,
        dispatch,
        searchTerm
      );
      setTotalPages(totalPagesFromApi); // Mengatur totalPages dari API
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  }, [dispatch, currentPage, itemsPerPage]);

  useEffect(() => {
    const loadStockIns = async () => {
      const totalPagesCount = await fetchStockIns(
        currentPage,
        itemsPerPage,
        dispatch
      );
      setTotalPages(totalPagesCount);
      setLoading(false);
    };

    loadStockIns();
  }, [currentPage, itemsPerPage, dispatch]);

  useEffect(() => {
    fetchAndSetStockIns();
  }, [fetchAndSetStockIns]);

  const handleDetailClick = async (stockIn) => {
    const stockInDetail = await fetchStockInDetail(stockIn.id);
    setSelectedStockIn(stockInDetail);
    setShowModal(true);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const handleAddStockIn = async (formData) => {
    try {
      await addStockInService(formData, dispatch);
      setShowModal(false);
      await fetchAndSetStockIns();
    } catch (err) {
      console.error("Error adding stock-in", err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStockIn(null);
  };

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="container mt-4">
          <h1 className="mb-4">Stock-in List</h1>
          <TableAction
            type="stockIn"
            onAdd={handleAddStockIn}
            onSearch={handleSearch}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <StockInTable
            stockIns={sortedStockIns}
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
            stockData={selectedStockIn}
          />
        </div>
      )}
    </>
  );
};

export default StockInPage;
