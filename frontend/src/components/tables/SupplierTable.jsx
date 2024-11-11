// SupplierTable.jsx
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

const SupplierTable = ({
  suppliers,
  onDetailClick,
  onDeleteClick,
  onSort,
  onToggleClick,
  role,
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
            onClick={() => onSort("supplier_code")}
            style={{ cursor: "pointer" }}
          >
            {sortConfig.key === "supplier_code" &&
            sortConfig.direction === "ascending" ? (
              <ArrowDropUp />
            ) : null}
            {sortConfig.key === "supplier_code" &&
            sortConfig.direction === "descending" ? (
              <ArrowDropDown />
            ) : null}
            Supplier Code
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
          {role === "supervisor" && <th>Active Status</th>}
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {suppliers && suppliers.length > 0 ? (
          suppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td>{supplier.supplier_code}</td>
              <td>{supplier.supplier_name}</td>
              <td>{formatDate(supplier.updatedAt)}</td>
              <td>{supplier.Updater ? supplier.Updater.username : "-"}</td>
              {role === "supervisor" && (
                <td
                  onClick={() => onToggleClick(supplier)}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {supplier.isDeleted ? (
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
              )}
              <td>
                {/* Icon for Detail */}
                <span
                  onClick={() => onDetailClick(supplier)}
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    marginRight: "4px",
                  }}
                >
                  <Article style={{ fontSize: "2rem", textAlign: "center" }} />
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={role === "supervisor" ? 6 : 5}>
              No suppliers available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default SupplierTable;
