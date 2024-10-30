// TableAction.jsx
import React from "react";
import AddProduct from "./action_bar/AddProduct";
import AddSupplier from "./action_bar/AddSupplier";
import AddStockIn from "./action_bar/AddStockIn";
import { Form, InputGroup } from "react-bootstrap";
import { SearchOutlined } from "@mui/icons-material";

const TableAction = ({ onAdd, onSearch, searchTerm, setSearchTerm, type }) => {
  const handleSearchChange = (event) => {
    const keyword = event.target.value;
    setSearchTerm(keyword);
    onSearch(keyword);
  };
  return (
    <div
      style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
    >
      {type === "product" ? (
        <AddProduct onSubmit={onAdd} style={{ marginRight: "1rem" }} />
      ) : type === "supplier" ? (
        <AddSupplier onSubmit={onAdd} style={{ marginRight: "1rem" }} />
      ) : type === "stockIn" ? (
        <AddStockIn onSubmit={onAdd} style={{ marginRight: "1rem" }} />
      ) : null}

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
              : "Search stock in..."
          }
          value={searchTerm}
          onChange={handleSearchChange}
          aria-label={`Search ${
            type === "product"
              ? "products"
              : type === "supplier"
              ? "suppliers"
              : "stock in"
          }`}
          aria-describedby="search-addon"
        />
      </InputGroup>
    </div>
  );
};

export default TableAction;
