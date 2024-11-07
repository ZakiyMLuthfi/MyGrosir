import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStockIns,
  addStockInService,
  fetchStockInDetail,
} from "../../services/stockService";
import { fetchUsers } from "../../services/userServices";
import { setUsers } from "../../reducers/userActions";
import { setToken } from "../../reducers/userActions";

import debounce from "lodash.debounce";
import StockDetailModal from "../modals/stockDetailModal";
import StockInTable from "../tables/StockInTable";
import TableAction from "../TableAction";
import PaginationComponent from "../PaginationComponent";
import "../css/Table.css";

const StockInPage = () => {
  const dispatch = useDispatch();
  const stockIns = useSelector((state) => state.inventory.stockIns || []);
  const users = useSelector((state) => state.inventory.users || []);
  const role = useSelector((state) => state.inventory.role);

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
    if (!stockIns || !Array.isArray(stockIns)) return [];
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
        dispatch
      );
      setTotalPages(totalPagesFromApi); // Mengatur totalPages dari API
    } catch (err) {
      console.error("Error fetching stock-in", err);
    } finally {
      setLoading(false);
    }
  }, [dispatch, currentPage, itemsPerPage]);

  const fetchAndSetUsers = useCallback(async () => {
    try {
      const response = await fetchUsers(currentPage, itemsPerPage, dispatch);
      if (response.users) {
        dispatch(setUsers(response.users));
      }
    } catch (err) {
      console.error("Error fetching users", err);
    }
  }, [dispatch, currentPage, itemsPerPage]);

  useEffect(() => {
    const storedRole = localStorage.getItem("accessRole");
    const storedToken = localStorage.getItem("accessToken");

    if (storedRole && !role && storedToken) {
      dispatch(setToken({ token: storedToken, role: storedRole }));
    }
  }, [dispatch, role]);

  useEffect(() => {
    fetchAndSetStockIns();
  }, [role, currentPage, itemsPerPage]);

  const handleDetailClick = async (stockIn) => {
    const stockInDetail = await fetchStockInDetail(stockIn.id);
    setSelectedStockIn(stockInDetail);
    setShowModal(true);
    await fetchAndSetUsers();
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
            role={role}
          />

          <div className="product-table mb-4">
            <StockInTable
              stockIns={sortedStockIns}
              onDetailClick={handleDetailClick}
              onSort={handleSort}
              sortConfig={sortConfig}
              role={role}
            />
          </div>

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
            type="stock-in"
            users={users}
            role={role}
          />
        </div>
      )}
    </>
  );
};

export default StockInPage;
