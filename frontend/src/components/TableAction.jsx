import React from "react";
import AddProduct from "./action_bar/AddProduct";
import AddSupplier from "./action_bar/AddSupplier";
import AddStockIn from "./action_bar/AddStockIn";
import AddStockOut from "./action_bar/AddStockOut";
import AddUser from "./action_bar/AddUser";
import { Form, InputGroup } from "react-bootstrap";
import { SearchOutlined } from "@mui/icons-material";

const TableAction = ({
  onAdd,
  onSearch,
  searchTerm,
  setSearchTerm,
  type,
  role,
}) => {
  const handleSearchChange = (event) => {
    const keyword = event.target.value;
    setSearchTerm(keyword);
    onSearch(keyword);
  };

  return (
    <div
      style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
    >
      {(role === "admin" ||
        ((role === "superadmin" || role === "supervisor") &&
          type === "user")) && (
        <>
          {type === "product" && role === "admin" && (
            <AddProduct onSubmit={onAdd} style={{ marginRight: "1rem" }} />
          )}
          {type === "supplier" && role === "admin" && (
            <AddSupplier onSubmit={onAdd} style={{ marginRight: "1rem" }} />
          )}
          {type === "stockIn" && role === "admin" && (
            <AddStockIn onSubmit={onAdd} style={{ marginRight: "1rem" }} />
          )}
          {type === "stockOut" && role === "admin" && (
            <AddStockOut onSubmit={onAdd} style={{ marginRight: "1rem" }} />
          )}
          {type === "user" &&
            (role === "superadmin" || role === "supervisor") && (
              <AddUser
                onSubmit={onAdd}
                style={{ marginRight: "1rem" }}
                role={role}
              />
            )}
        </>
      )}

      {/* Search component */}
      <InputGroup style={{ width: "300px", marginLeft: "0.5rem" }}>
        <InputGroup.Text style={{ padding: "5px 10px" }}>
          <SearchOutlined />
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder={
            type === "product"
              ? "Search products..."
              : type === "supplier"
              ? "Search suppliers..."
              : type === "stockIn"
              ? "Search stock in..."
              : type === "stockOut"
              ? "Search stock out..."
              : type === "user"
              ? "Search user..."
              : "Search..."
          }
          value={searchTerm}
          onChange={handleSearchChange}
          aria-label={`Search ${
            type === "product"
              ? "products"
              : type === "supplier"
              ? "suppliers"
              : type === "stockIn"
              ? "stock in"
              : type === "stockOut"
              ? "stock out"
              : type === "user"
              ? "user"
              : ""
          }`}
          aria-describedby="search-addon"
        />
      </InputGroup>
    </div>
  );
};

export default TableAction;
