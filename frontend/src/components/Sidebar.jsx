import React, { useState, useEffect } from "react";
import { ListGroup, Accordion } from "react-bootstrap";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useSelector } from "react-redux";
import "./Sidebar.css";

const Sidebar = ({ isOpen }) => {
  const [openStocks, setOpenStocks] = useState(false);
  const [username, setUsername] = useState("");
  const role = useSelector((state) => state.inventory.role);

  const toggleStocks = () => {
    setOpenStocks((prev) => !prev);
  };

  const upperRoles = ["superadmin", "supervisor"]; // Role yang dapat mengakses halaman Users
  const isSuperAdmin = role === "superadmin";
  const users = useSelector((state) => state.inventory.users || []);
  const canAccessUsers = upperRoles.includes(role);

  // useEffect(() => {
  //   // Ambil userId dari localStorage
  //   const userId = Number(localStorage.getItem("loggedInUserId"));

  //   const user = users.find((users) => users.id === userId);

  //   if (user) {
  //     setUsername(user.username);
  //   }
  // }, [users, role]);

  return (
    <div>
      <div className="p-3 text-lg font-bold sidebar-title">MyGrosir</div>
      <ListGroup variant="flush">
        <ListGroup.Item
          as={Link}
          to="/dashboard"
          action
          className="sidebar-item no-border"
        >
          <DashboardIcon className="sidebar-icon" />
          {isOpen ? "Dashboard" : ""}
        </ListGroup.Item>

        {/* Hanya tampilkan item berikut jika role bukan superadmin */}
        {!isSuperAdmin && (
          <>
            <ListGroup.Item
              as={Link}
              to="/products"
              action
              className="sidebar-item no-border"
            >
              <InventoryIcon className="sidebar-icon" />
              {isOpen ? "Products" : ""}
            </ListGroup.Item>
            <ListGroup.Item
              as={Link}
              to="/suppliers"
              action
              className="sidebar-item no-border"
            >
              <PeopleAltIcon className="sidebar-icon" />
              {isOpen ? "Suppliers" : ""}
            </ListGroup.Item>
            <Accordion>
              <ListGroup.Item
                action
                className="sidebar-item accordion-toggle no-border"
                onClick={toggleStocks}
              >
                <WarehouseIcon className="sidebar-icon" />
                {isOpen ? "Stocks" : ""}
                {isOpen &&
                  (openStocks ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
              </ListGroup.Item>
              <Accordion.Collapse in={openStocks}>
                <ListGroup variant="flush">
                  <ListGroup.Item
                    as={Link}
                    to="/stocks/stock-in"
                    className="sidebar-item no-border"
                  >
                    <AssignmentIcon className="sidebar-icon" />
                    {isOpen ? "Stock-in" : ""}
                  </ListGroup.Item>
                  <ListGroup.Item
                    as={Link}
                    to="/stocks/stock-out"
                    className="sidebar-item no-border"
                  >
                    <LocalShippingIcon className="sidebar-icon" />
                    {isOpen ? "Stock-out" : ""}
                  </ListGroup.Item>
                  <ListGroup.Item
                    as={Link}
                    to="/stocks/stock-history"
                    className="sidebar-item no-border"
                  >
                    <HistoryIcon className="sidebar-icon" />
                    {isOpen ? "Histories" : ""}
                  </ListGroup.Item>
                </ListGroup>
              </Accordion.Collapse>
            </Accordion>
          </>
        )}

        {/* Tampilkan kolom Users hanya jika pengguna memiliki akses */}
        {canAccessUsers && (
          <ListGroup.Item
            as={Link}
            to="/users"
            action
            className="sidebar-item no-border"
          >
            <PersonIcon className="sidebar-icon" />
            {isOpen ? "Users" : ""}
          </ListGroup.Item>
        )}
      </ListGroup>
      {/* <div className="p-3 sidebar-username">Logged in as {username}</div> */}
    </div>
  );
};

export default Sidebar;
