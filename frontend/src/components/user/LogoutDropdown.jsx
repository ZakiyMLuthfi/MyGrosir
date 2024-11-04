// LogoutDropdown.jsx
import React from "react";
import { Button } from "react-bootstrap"; // Atau Anda bisa menggunakan styled button

const LogoutDropdown = ({ onLogout }) => {
  const handleLogout = async () => {
    try {
      // Panggil API untuk logout
      const response = await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        credentials: "include", // Jika menggunakan cookie, atau sesuaikan dengan kebutuhan Anda
      });

      if (response.ok) {
        // Jika logout berhasil
        onLogout();
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="logout-dropdown">
      <Button variant="link" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default LogoutDropdown;
