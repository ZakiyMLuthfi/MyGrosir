// ProductTable.jsx
import React from "react";
import moment from "moment-timezone";
import {
  ArrowDropUp,
  ArrowDropDown,
  Article,
  Delete,
  ToggleOn,
  ToggleOff,
} from "@mui/icons-material";

const ProductTable = ({
  products,
  onDetailClick,
  onDeleteClick,
  onSort,
  onToggleClick,
  sortConfig = { key: "", direction: "ascending" },
}) => {
  // format waktu untuk ditampilkan pada FE
  const formatDate = (dateString) => {
    return moment(dateString).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
  };

  return (
    <table className="table table-bordered">
      <thead className="thead-light">
        <tr>
          <th
            onClick={() => onSort("product_code")}
            style={{ cursor: "pointer" }}
          >
            {sortConfig.key === "product_code" &&
            sortConfig.direction === "ascending" ? (
              <ArrowDropUp />
            ) : null}
            {sortConfig.key === "product_code" &&
            sortConfig.direction === "descending" ? (
              <ArrowDropDown />
            ) : null}
            Product Code
          </th>
          <th
            onClick={() => onSort("product_name")}
            style={{ cursor: "pointer" }}
          >
            {sortConfig.key === "product_name" &&
            sortConfig.direction === "ascending" ? (
              <ArrowDropUp />
            ) : null}
            {sortConfig.key === "product_name" &&
            sortConfig.direction === "descending" ? (
              <ArrowDropDown />
            ) : null}
            Product Name
          </th>
          <th onClick={() => onSort("updatedAt")} style={{ cursor: "pointer" }}>
            {sortConfig.key === "updatedAt" &&
            sortConfig.direction === "ascending" ? (
              <ArrowDropUp />
            ) : null}
            {sortConfig.key === "updatedAt" &&
            sortConfig.direction === "descending" ? (
              <ArrowDropDown />
            ) : null}
            Updated at
          </th>
          <th
            onClick={() => onSort("updated_by")}
            style={{ cursor: "pointer" }}
          >
            {sortConfig.key === "updated_by" &&
            sortConfig.direction === "ascending" ? (
              <ArrowDropUp />
            ) : null}
            {sortConfig.key === "updated_by" &&
            sortConfig.direction === "descending" ? (
              <ArrowDropDown />
            ) : null}
            Updated by
          </th>
          <th>isDeleted?</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {products && products.length > 0 ? (
          products.map((product) => (
            <tr key={product.id}>
              <td>{product.product_code}</td>
              <td>{product.product_name}</td>
              <td>{formatDate(product.updatedAt)}</td>
              <td>{product.updated_by}</td>
              <td
                onClick={() => onToggleClick(product)}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {product.isDeleted ? (
                  <ToggleOn
                    className="toggle-icon"
                    style={{
                      color: "red",
                      cursor: "pointer",
                      fontSize: "2.2rem",
                      transform: "scale(1.5, 1.5)",
                      transition: "transform 0.3s ease, color 0.3s ease",
                    }}
                  />
                ) : (
                  <ToggleOff
                    className="toggle-icon"
                    style={{
                      color: "green",
                      cursor: "pointer",
                      fontSize: "2.2rem",
                      transform: "scale(1.5, 1.5)",
                      transition: "transform 0.3s ease, color 0.3s ease",
                    }}
                  />
                )}
              </td>
              <td>
                {/* Icon for Detail */}
                <span
                  onClick={() => onDetailClick(product)}
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    marginRight: "4px",
                  }}
                >
                  <Article />
                </span>
                {/* Icon for Delete */}
                <span
                  onClick={() => onDeleteClick(product)}
                  style={{ cursor: "pointer", color: "red" }}
                >
                  <Delete />
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">No products available</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ProductTable;
