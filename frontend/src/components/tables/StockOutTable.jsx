// StockOutTable.jsx
import React from "react";
import moment from "moment-timezone";
import { ArrowDropUp, ArrowDropDown, Article } from "@mui/icons-material";

const StockOutTable = ({
  stockOuts,
  onDetailClick,
  onSort,
  sortConfig = { key: "", direction: "ascending" },
}) => {
  // format waktu untuk ditampilkan pada FE
  const formatDate = (dateString) => {
    return moment(dateString).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
  };

  const getStatusStyle = (quantity_remaining) => {
    return {
      backgroundColor: quantity_remaining === 0 ? "grey" : "green",
      color: "white",
      padding: "2px 4px",
      borderRadius: "6px",
      display: "inline-block",
      textAlign: "center",
      minWidth: "60px",
    };
  };

  return (
    <table className="table table-bordered">
      <thead className="thead-light">
        <tr>
          <th
            onClick={() => onSort("stock_code")}
            style={{ cursor: "pointer" }}
          >
            {sortConfig.key === "stock_code" &&
            sortConfig.direction === "ascending" ? (
              <ArrowDropUp />
            ) : null}
            {sortConfig.key === "stock_code" &&
            sortConfig.direction === "descending" ? (
              <ArrowDropDown />
            ) : null}
            Stock Code
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
          <th onClick={() => onSort("quantity")} style={{ cursor: "pointer" }}>
            {sortConfig.key === "quantity" &&
            sortConfig.direction === "ascending" ? (
              <ArrowDropUp />
            ) : null}
            {sortConfig.key === "quantity" &&
            sortConfig.direction === "descending" ? (
              <ArrowDropDown />
            ) : null}
            Quantity
          </th>
          <th
            onClick={() => onSort("quantity_remaining")}
            style={{ cursor: "pointer" }}
          >
            {sortConfig.key === "quantity_remaining" &&
            sortConfig.direction === "ascending" ? (
              <ArrowDropUp />
            ) : null}
            {sortConfig.key === "quantity_remaining" &&
            sortConfig.direction === "descending" ? (
              <ArrowDropDown />
            ) : null}
            Remaining
          </th>
          <th
            onClick={() => onSort("status")}
            style={{ cursor: "pointer", textAlign: "center" }}
          >
            {sortConfig.key === "status" &&
            sortConfig.direction === "ascending" ? (
              <ArrowDropUp />
            ) : null}
            {sortConfig.key === "status" &&
            sortConfig.direction === "descending" ? (
              <ArrowDropDown />
            ) : null}
            Status
          </th>
          <th onClick={() => onSort("createdAt")} style={{ cursor: "pointer" }}>
            {sortConfig.key === "createdAt" &&
            sortConfig.direction === "ascending" ? (
              <ArrowDropUp />
            ) : null}
            {sortConfig.key === "createdAt" &&
            sortConfig.direction === "descending" ? (
              <ArrowDropDown />
            ) : null}
            Entry date
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
            Last Update
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
          <th>Detail</th>
        </tr>
      </thead>
      <tbody>
        {stockOuts && stockOuts.length > 0 ? (
          stockOuts.map((stockOut) => (
            <tr key={stockOut.id}>
              <td>{stockOut.stock_code}</td>
              <td>{stockOut.product ? stockOut.product.product_name : "-"}</td>
              <td>{stockOut.quantity} pack</td>
              <td>{stockOut.quantity_remaining} pack left</td>
              <td>
                <span style={getStatusStyle(stockOut.quantity_remaining)}>
                  {stockOut.quantity_remaining === 0 ? "Empty" : "Ready"}
                </span>
              </td>
              <td>{formatDate(stockOut.createdAt)}</td>
              <td>{formatDate(stockOut.updatedAt)}</td>
              <td>{stockOut.Creator ? stockOut.Creator.username : "-"}</td>
              <td>
                {/* Icon for Detail */}
                <div
                  onClick={() => onDetailClick(stockOut)}
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Article style={{ fontSize: "2rem" }} />
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="9">No Stock-out available</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default StockOutTable;
