// StockInTable.jsx
import React from "react";
import moment from "moment-timezone";
import { ArrowDropUp, ArrowDropDown, Article } from "@mui/icons-material";

const StockInTable = ({
  stockIns,
  onDetailClick,
  onSort,
  sortConfig = { key: "", direction: "ascending" },
  role,
}) => {
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
            Code
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
            style={{ cursor: "pointer", textAlign: "center" }}
          >
            {sortConfig.key === "quantity_remaining" &&
            sortConfig.direction === "ascending" ? (
              <ArrowDropUp />
            ) : null}
            {sortConfig.key === "quantity_remaining" &&
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
            Entry Date
          </th>
          {role === "superadmin" && (
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
              Author
            </th>
          )}
          {role === "admin" || role === "superadmin" ? <th>Detail</th> : null}
        </tr>
      </thead>
      <tbody>
        {stockIns && stockIns.length > 0 ? (
          stockIns.map((stockIn) => (
            <tr key={stockIn.id}>
              <td>{stockIn.stock_code}</td>
              <td>{stockIn.supplier ? stockIn.supplier.supplier_name : "-"}</td>
              <td>{stockIn.product ? stockIn.product.product_name : "-"}</td>
              <td>{stockIn.quantity} pack</td>
              <td>
                <span style={getStatusStyle(stockIn.quantity_remaining)}>
                  {stockIn.quantity_remaining === 0 ? "Empty" : "Stored"}
                </span>
              </td>
              <td>{formatDate(stockIn.createdAt)}</td>
              {role === "superadmin" && (
                <td>{stockIn.Creator ? stockIn.Creator.username : "-"}</td>
              )}
              {(role === "admin" || role === "superadmin") && (
                <td>
                  <div
                    onClick={() => onDetailClick(stockIn)}
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
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={role === "superadmin" ? 8 : 7}>
              No Stock-in available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default StockInTable;
