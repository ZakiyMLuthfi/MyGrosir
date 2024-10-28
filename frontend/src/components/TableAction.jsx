// TableAction.jsx
import React, { useState } from "react";
import AddProduct from "./action_bar/AddProduct";
import { Form, InputGroup } from "react-bootstrap";
import { SearchOutlined } from "@mui/icons-material";

const TableAction = ({ onAddProduct, onSearch, searchTerm, setSearchTerm }) => {
  const handleSearchChange = (event) => {
    const keyword = event.target.value;
    setSearchTerm(keyword);
    onSearch(keyword);
  };
  return (
    <div
      style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
    >
      <AddProduct onSubmit={onAddProduct} style={{ marginRight: "1rem" }} />
      {/* Search component */}
      <InputGroup style={{ width: "300px", marginLeft: "0.5rem" }}>
        <InputGroup.Text style={{ padding: "5px 10px" }}>
          <SearchOutlined />
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          aria-label="Search products"
          aria-describedby="search-addon"
        />
      </InputGroup>
    </div>
  );
};

export default TableAction;
