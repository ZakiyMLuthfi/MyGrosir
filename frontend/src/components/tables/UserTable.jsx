// UserTable.jsx
import React from "react";
import formatDate from "../../utils/converter";
import {
  ArrowDropUp,
  ArrowDropDown,
  Article,
  ToggleOn,
  ToggleOff,
} from "@mui/icons-material";

const UserTable = ({
  users,
  onDetailClick,
  onSort,
  onToggleClick,
  role,
  sortConfig = { key: "", direction: "ascending" },
}) => {
  const getStatusStyle = (is_active) => {
    return {
      backgroundColor: is_active === false ? "grey" : "green",
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
          <th onClick={() => onSort("id")} style={{ cursor: "pointer" }}>
            {sortConfig.key === "id" && sortConfig.direction === "ascending" ? (
              <ArrowDropUp />
            ) : null}
            {sortConfig.key === "id" &&
            sortConfig.direction === "descending" ? (
              <ArrowDropDown />
            ) : null}
            No.
          </th>
          <th onClick={() => onSort("username")} style={{ cursor: "pointer" }}>
            {sortConfig.key === "username" &&
            sortConfig.direction === "ascending" ? (
              <ArrowDropUp />
            ) : null}
            {sortConfig.key === "username" &&
            sortConfig.direction === "descending" ? (
              <ArrowDropDown />
            ) : null}
            Username
          </th>
          <th onClick={() => onSort("is_active")} style={{ cursor: "pointer" }}>
            {sortConfig.key === "is_active" &&
            sortConfig.direction === "ascending" ? (
              <ArrowDropUp />
            ) : null}
            {sortConfig.key === "is_active" &&
            sortConfig.direction === "descending" ? (
              <ArrowDropDown />
            ) : null}
            Status
          </th>
          <th>Detail</th>
          {role === "superadmin" && <th>Delete</th>}
          <th onClick={() => onSort("createdAt")} style={{ cursor: "pointer" }}>
            {sortConfig.key === "createdAt" &&
            sortConfig.direction === "ascending" ? (
              <ArrowDropUp />
            ) : null}
            {sortConfig.key === "createdAt" &&
            sortConfig.direction === "descending" ? (
              <ArrowDropDown />
            ) : null}
            Create date
          </th>
        </tr>
      </thead>
      <tbody>
        {users && users.length > 0 ? (
          users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>
                <span style={getStatusStyle(user.is_active)}>
                  {user.is_active === false ? "Inactive" : "Active"}
                </span>
              </td>
              <td
                onClick={() => onDetailClick(user)}
                style={{
                  cursor: "pointer",
                  color: "blue",
                  marginRight: "4px",
                }}
              >
                <Article />
              </td>
              {role === "superadmin" && (
                <td
                  onClick={() => onToggleClick(user)}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {user.is_deleted ? (
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
              <td>{formatDate(user.createdAt)}</td>
            </tr>
          ))
        ) : (
          <td colSpan={role === "superadmin" ? 6 : 5}>No users available</td>
        )}
      </tbody>
    </table>
  );
};

export default UserTable;
