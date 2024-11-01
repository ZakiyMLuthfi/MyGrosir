// StockHistoryTable.jsx
import React from "react";
import moment from "moment-timezone";
import { ArrowDropUp, ArrowDropDown, Article } from "@mui/icons-material";

const StockHistoryTable = ({
  stockHistories,
  onDetailClick,
  onSort,
  sortConfig = { key: "", direction: "ascending" },
}) => {
  // format waktu untuk ditampilkan pada FE
  const formatDate = (dateString) => {
    return moment(dateString).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
  };

  //   const getStatusStyle = (quantity_remaining) => {
  //     return {
  //       backgroundColor: quantity_remaining === 0 ? "grey" : "green",
  //       color: "white",
  //       padding: "2px 4px",
  //       borderRadius: "6px",
  //       display: "inline-block",
  //       textAlign: "center",
  //       minWidth: "60px",
  //     };
  //   };

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
            onClick={() => onSort("grosir_choice")}
            style={{ cursor: "pointer" }}
          >
            {sortConfig.key === "grosir_choice" &&
            sortConfig.direction === "ascending" ? (
              <ArrowDropUp />
            ) : null}
            {sortConfig.key === "grosir_choice" &&
            sortConfig.direction === "descending" ? (
              <ArrowDropDown />
            ) : null}
            Grosir destination
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
            Author
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
            Sent date
          </th>
          <th>Detail</th>
        </tr>
      </thead>
      <tbody>
        {stockHistories && stockHistories.length > 0 ? (
          stockHistories.map((stockHistory) => (
            <tr key={stockHistory.id}>
              <td>{stockHistory.stock_code}</td>
              <td>
                {stockHistory.product ? stockHistory.product.product_name : "-"}
              </td>
              <td>{stockHistory.quantity} pkg</td>
              <td>{stockHistory.grosir_choice}</td>
              <td>{stockHistory.created_by}</td>
              <td>{formatDate(stockHistory.createdAt)}</td>
              <td>
                {/* Icon for Detail */}
                <div
                  onClick={() => onDetailClick(stockHistory)}
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
            <td colSpan="7">No Stock History available</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default StockHistoryTable;