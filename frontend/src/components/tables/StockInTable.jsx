// SupplierTable.jsx
import React from "react";
import moment from "moment-timezone";
import {
  ArrowDropUp,
  ArrowDropDown,
  Article,
  Delete,
} from "@mui/icons-material";

const StockInTable = ({
  stockIns,
  onDetailClick,
  onSort,
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
            onClick={() => onSort("supplier_name")}
            style={{ cursor: "pointer" }}
          >
            {sortConfig.key === "supplier_name" &&
            sortConfig.direction === "ascending" ? (
              <ArrowDropUp />
            ) : null}
            {sortConfig.key === "supplier_name" &&
            sortConfig.direction === "descending" ? (
              <ArrowDropDown />
            ) : null}
            Supplier Name
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
            onClick={() => onSort("created_by")}
            style={{ cursor: "pointer" }}
          >
            {sortConfig.key === "created_by" &&
            sortConfig.direction === "ascending" ? (
              <ArrowDropUp />
            ) : null}
            {sortConfig.key === "created_by" &&
            sortConfig.direction === "descending" ? (
              <ArrowDropDown />
            ) : null}
            Created by
          </th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {stockIns && stockIns.length > 0 ? (
          stockIns.map((stockIn) => (
            <tr key={stockIn.id}>
              <td>{stockIn.stock_code}</td>
              <td>{stockIn.supplier ? stockIn.supplier.supplier_name : "-"}</td>
              <td>{stockIn.product ? stockIn.product.product_name : "-"}</td>
              <td>{formatDate(stockIn.updatedAt)}</td>
              <td>{stockIn.created_by}</td>
              <td>
                {/* Icon for Detail */}
                <span
                  onClick={() => onDetailClick(stockIn)}
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    marginRight: "4px",
                  }}
                >
                  <Article />
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">No Stock-in available</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default StockInTable;