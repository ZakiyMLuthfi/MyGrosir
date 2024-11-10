import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSuppliers,
  fetchSupplierDetail,
  updateSupplier,
  addSupplierService,
  deleteSupplierService,
  restoreSupplierService,
} from "../../services/supplierService";
import { fetchUsers } from "../../services/userServices";
import { setToken } from "../../reducers/userActions";
import debounce from "lodash.debounce";
import SupplierDetailModal from "../modals/supplierDetailModal";
import SupplierTable from "../tables/SupplierTable";
import TableAction from "../TableAction";
import PaginationComponent from "../PaginationComponent";
import "../css/Table.css";

const SupplierPage = () => {
  const dispatch = useDispatch();
  const suppliers = useSelector(
    (state) => state.inventory.suppliers.suppliers || []
  );
  const users = useSelector((state) => state.inventory.users || []);
  const role = useSelector((state) => state.inventory.role);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const handleSearch = useCallback(
    debounce(async (keyword) => {
      await fetchSuppliers(currentPage, itemsPerPage, dispatch, keyword);
    }, 500),
    [currentPage, itemsPerPage, dispatch]
  );

  const sortedSuppliers = React.useMemo(() => {
    if (!suppliers || !Array.isArray(suppliers)) return [];
    let sortableSuppliers = [...suppliers];
    if (sortConfig !== null) {
      sortableSuppliers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableSuppliers;
  }, [suppliers, sortConfig]);

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

  // Memanggil all supplier
  const fetchAndSetSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const totalPagesFromApi = await fetchSuppliers(
        currentPage,
        itemsPerPage,
        dispatch
      );
      setTotalPages(totalPagesFromApi); // Mengatur totalPages dari API
    } catch (err) {
      console.error("Error fetching suppliers", err);
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
    const storedId = localStorage.getItem("loggedInUserId");

    if (storedRole && storedToken && !role) {
      dispatch(
        setToken({ token: storedToken, role: storedRole, userId: storedId })
      );
    }
  }, [dispatch, role]);

  useEffect(() => {
    if (role) {
      fetchAndSetSuppliers();
    }
  }, [role, currentPage, itemsPerPage]);

  // const handleDeleteClick = async (supplier) => {
  //   const confirmDelete = window.confirm(
  //     `Are you sure you want to delete ${supplier.supplier_name}?`
  //   );
  //   if (confirmDelete) {
  //     try {
  //       await deleteSupplierService(supplier.id, dispatch);
  //     } catch (err) {
  //       console.error("Failed to delete supplier:", err);
  //     }
  //   }
  // };

  const handleToggleDelete = async (supplier) => {
    if (supplier.isDeleted) {
      await restoreSupplierService(supplier.id, dispatch);
    } else {
      await deleteSupplierService(supplier.id, dispatch);
    }
    fetchAndSetSuppliers();
  };

  const handleDetailClick = async (supplier) => {
    try {
      const supplierDetail = await fetchSupplierDetail(supplier.id);
      setSelectedSupplier(supplierDetail);
      setShowModal(true);
      await fetchAndSetUsers();
    } catch (error) {
      console.error("Error fetching product detail:", error);
      alert("Failed to load product details. Please try again later.");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const handleAddSupplier = async (formData) => {
    try {
      await addSupplierService(formData, dispatch);
      setShowModal(false);
      await fetchAndSetSuppliers();
    } catch (err) {
      console.error("Error adding supplier", err);
    }
  };

  const handleUpdateClick = () => {
    setIsEditing(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSupplier(null);
    setIsEditing(false);
  };

  const handleSaveChanges = async (updatedSupplierData) => {
    try {
      await updateSupplier(selectedSupplier.id, updatedSupplierData);
      await fetchAndSetSuppliers();
      handleCloseModal(); // Menutup modal dan reset state
    } catch (error) {
      console.error("Error updating supplier", error);
    }
  };

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="container mt-4">
          <h1 className="mb-4">Supplier List</h1>
          <TableAction
            type="supplier"
            onAdd={handleAddSupplier}
            onSearch={handleSearch}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            role={role}
          />
          <div className="product-table mb-4">
            <SupplierTable
              suppliers={sortedSuppliers}
              onDetailClick={handleDetailClick}
              onSort={handleSort}
              onToggleClick={handleToggleDelete}
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

          <SupplierDetailModal
            show={showModal}
            onClose={handleCloseModal}
            supplierData={selectedSupplier}
            isEditing={isEditing}
            onUpdate={handleSaveChanges}
            onToggleEdit={handleUpdateClick}
            users={users}
            role={role}
          />
        </div>
      )}
    </>
  );
};

export default SupplierPage;
