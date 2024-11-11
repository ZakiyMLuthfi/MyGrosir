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
import "../css/Table.css";

const UserTable = ({
  users,
  onDetailClick,
  onSort,
  onToggleClick,
  role,
  loggedInUserId,
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

  const getRoleStyle = (role) => {
    switch (role) {
      case "admin":
        return {
          backgroundColor: "#4caf50", // Green for admin
          color: "white",
          borderRadius: "4px",
          padding: "5px 10px",
          display: "inline-block",
          minWidth: "60px",
        };
      case "supervisor":
        return {
          backgroundColor: "#ffa500", // Orange for supervisor
          color: "white",
          borderRadius: "4px",
          padding: "5px 10px",
          display: "inline-block",
          minWidth: "60px",
        };
      case "superadmin":
        return {
          backgroundColor: "#007bff", // Blue for superadmin
          color: "white",
          borderRadius: "4px",
          padding: "5px 10px",
          display: "inline-block",
          minWidth: "60px",
        };
      default:
        return {}; // Default to empty if role is unknown
    }
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
          <th onClick={() => onSort("role")} style={{ cursor: "pointer" }}>
            {sortConfig.key === "role" &&
            sortConfig.direction === "ascending" ? (
              <ArrowDropUp />
            ) : null}
            {sortConfig.key === "role" &&
            sortConfig.direction === "descending" ? (
              <ArrowDropDown />
            ) : null}
            Role
          </th>
          <th style={{ textAlign: "center" }}>Detail</th>
          <th style={{ textAlign: "center" }}>Active Status</th>
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
                  {user.is_active === false ? "Offline" : "Online"}
                </span>
              </td>
              <td style={{ ...getRoleStyle(user.role), textAlign: "center" }}>
                {user.role}
              </td>
              <td
                onClick={() => onDetailClick(user)}
                style={{
                  cursor: "pointer",
                  color: "blue",
                  marginRight: "4px",
                  textAlign: "center",
                }}
              >
                <Article />
              </td>
              <td
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {role === "superadmin" &&
                  user.id !== loggedInUserId &&
                  (user.role === "admin" || user.role === "supervisor") && (
                    <span
                      onClick={() => onToggleClick(user)}
                      style={{ cursor: "pointer" }}
                    >
                      {user.is_deleted ? (
                        <ToggleOn
                          className="toggle-icon"
                          style={{
                            color: "red",
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
                            fontSize: "2.2rem",
                            transform: "scale(1.5, 1.5)",
                            transition: "transform 0.3s ease, color 0.3s ease",
                          }}
                        />
                      )}
                    </span>
                  )}

                {role === "supervisor" &&
                  user.id !== loggedInUserId &&
                  user.role === "admin" && (
                    <span
                      onClick={() => onToggleClick(user)}
                      style={{ cursor: "pointer" }}
                    >
                      {user.is_deleted ? (
                        <ToggleOn
                          className="toggle-icon"
                          style={{
                            color: "red",
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
                            fontSize: "2.2rem",
                            transform: "scale(1.5, 1.5)",
                            transition: "transform 0.3s ease, color 0.3s ease",
                          }}
                        />
                      )}
                    </span>
                  )}
              </td>
              <td>{formatDate(user.createdAt)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={role === "supervisor" ? 6 : 5}>No users available</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default UserTable;
