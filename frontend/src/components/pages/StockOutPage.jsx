import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStockOuts,
  fetchStockOutDetail,
  updateStockOut,
} from "../../services/stockService";
import { fetchUsers } from "../../services/userServices";
import { setUsers } from "../../reducers/userActions";
import debounce from "lodash.debounce";
import StockDetailModal from "../modals/stockDetailModal";
import StockOutTable from "../tables/StockOutTable";
import TableAction from "../TableAction";
import PaginationComponent from "../PaginationComponent";

const StockOutPage = () => {
  const dispatch = useDispatch();
  const stockOuts = useSelector((state) => state.inventory.stockOuts || []);
  const users = useSelector((state) => state.inventory.users || []);
  const role = useSelector((state) => state.inventory.role);

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
          const statusA = a.quantity_remaining === 0 ? "Empty" : "Ready";
          const statusB = b.quantity_remaining === 0 ? "Empty" : "Ready";

          if (statusA !== statusB) {
            return sortConfig.direction === "ascending"
              ? statusA.localeCompare(statusB)
              : statusB.localeCompare(statusA);
          }
          return sortConfig.direction === "ascending"
            ? b.quantity_remaining - a.quantity_remaining
            : a.quantity_remaining - b.quantity_remaining;
        } else {
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

  const fetchAndSetStockOuts = useCallback(async () => {
    setLoading(true);
    try {
      const totalPagesFromApi = await fetchStockOuts(
        currentPage,
        itemsPerPage,
        dispatch
      );
      setTotalPages(totalPagesFromApi);
    } catch (err) {
      console.error("Error fetching stock-out", err);
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
    if (role) {
      fetchAndSetStockOuts();
    }
  }, [role, currentPage, itemsPerPage]);

  const handleDetailClick = async (stockOut) => {
    const stockOutDetail = await fetchStockOutDetail(stockOut.id);
    setSelectedStockOut(stockOutDetail);
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

  const handleAddStockOut = async (formData) => {
    try {
      await updateStockOut(formData);
      setShowModal(false);
      await fetchAndSetStockOuts();
    } catch (err) {
      console.error("Error adding stock-out", err);
    }
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
      handleCloseModal();
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
            type="stockOut"
            onAdd={handleAddStockOut}
            onSearch={handleSearch}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            role={role}
          />
          <StockOutTable
            stockOuts={sortedStockOuts}
            onDetailClick={handleDetailClick}
            onSort={handleSort}
            sortConfig={sortConfig}
            role={role}
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
            users={users}
            role={role}
          />
        </div>
      )}
    </>
  );
};

export default StockOutPage;
