// LayoutTemp.jsx
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Container, Row, Col } from "react-bootstrap";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import ProfileIcon from "./user/ProfileIcon";
import "./Layout.css";

const LayoutTemp = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoutSuccess = () => {
    console.log("User has logged out successfully!");
    navigate("/login");
    // Arahkan pengguna ke halaman login atau lakukan tindakan lain sesuai kebutuhan
  };

  return (
    <div className="d-flex">
      <div className={isOpen ? "sidebar-open" : "sidebar-closed"}>
        <Sidebar isOpen={isOpen} />
        <button className="drawer-toggle" onClick={toggleSidebar}>
          {isOpen ? (
            <KeyboardDoubleArrowLeftIcon />
          ) : (
            <KeyboardDoubleArrowRightIcon />
          )}
        </button>
      </div>

      <div
        className="main-content"
        style={{ marginLeft: isOpen ? "25px" : "60px" }}
      >
        <Container fluid>
          <Row>
            <Col>
              <div className="d-flex justify-content-end">
                <ProfileIcon onLogoutSuccess={handleLogoutSuccess} />
              </div>
              <Outlet />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default LayoutTemp;
