import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  fetchUserDetail,
  addUserService,
  deleteUserService,
  restoreUserService,
} from "../../services/userServices";
import debounce from "lodash.debounce";
import UserDetailModal from "../modals/userDetailModal";
import UserTable from "../tables/UserTable";
import TableAction from "../TableAction";
import PaginationComponent from "../PaginationComponent";
import "../css/Table.css";

const UserPage = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.inventory.users || []);
  const role = useSelector((state) => state.inventory.role);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const handleSearch = useCallback(
    debounce(async (keyword) => {
      await fetchUsers(currentPage, itemsPerPage, dispatch, keyword);
    }, 500),
    [currentPage, itemsPerPage, dispatch]
  );

  const sortedUsers = React.useMemo(() => {
    if (!users || !Array.isArray(users)) return [];
    let sortableUsers = [...users];
    if (sortConfig !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

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

  // Memanggil all user
  const fetchAndSetUsers = useCallback(async () => {
    setLoading(true);
    try {
      const totalPagesFromApi = await fetchUsers(
        currentPage,
        itemsPerPage,
        dispatch
      );
      setTotalPages(totalPagesFromApi); // Mengatur totalPages dari API
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  }, [dispatch, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchAndSetUsers();
  }, [fetchAndSetUsers]);

  const handleToggleDelete = async (user) => {
    if (user.is_deleted) {
      await restoreUserService(user.id, dispatch);
    } else {
      await deleteUserService(user.id, dispatch);
    }
    fetchAndSetUsers();
  };

  const handleDetailClick = async (user) => {
    try {
      const userDetail = await fetchUserDetail(user.id);
      setSelectedUser(userDetail);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching user detail:", error);
      alert("Failed to load user details. Please try again later.");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const handleAddUser = async (formData) => {
    try {
      await addUserService(formData, dispatch);
      setShowModal(false);
    } catch (err) {
      console.error("Error adding user", err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setIsEditing(false);
  };

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="container mt-4">
          <h1 className="mb-4">User List</h1>
          <TableAction
            type="user"
            onAdd={handleAddUser}
            onSearch={handleSearch}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            role={role}
          />
          <div className="mb-4">
            {" "}
            {/* Tambahkan margin bottom */}
            <UserTable
              users={sortedUsers}
              onDetailClick={handleDetailClick}
              onSort={handleSort}
              onToggleClick={handleToggleDelete}
              sortConfig={sortConfig}
            />
          </div>
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            itemsPerPage={itemsPerPage}
          />
          <UserDetailModal
            show={showModal}
            onClose={handleCloseModal}
            userData={selectedUser}
            users={users}
          />
        </div>
      )}
    </>
  );
};

export default UserPage;
