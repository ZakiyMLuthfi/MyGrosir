import React, { useState } from "react";
import { AccountCircle, Notifications } from "@mui/icons-material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch } from "react-redux";
import { clearToken } from "../../reducers/userActions";

const ProfileIcon = ({ onLogoutSuccess }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();

    try {
      const token = localStorage.getItem("accessToken");
      const role = localStorage.getItem("accessRole");

      if (!token && role) {
        console.warn("No token & role found, already logged out.");
        onLogoutSuccess();
        return;
      }
      const res = await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      // Hapus token dari Redux state dan localStorage
      dispatch(clearToken());
      localStorage.removeItem("accessToken"); // Hapus token dari localStorage
      localStorage.removeItem("accessRole");

      console.log("User logged out");
      onLogoutSuccess();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <Notifications style={{ fontSize: "42px", marginRight: "8px" }} />
      <AccountCircle
        style={{ cursor: "pointer", fontSize: 40 }}
        onClick={handleProfileMenuOpen}
      />

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            bgcolor: "background.paper",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default ProfileIcon;
