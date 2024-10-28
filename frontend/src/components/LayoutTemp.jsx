// LayoutTemp.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // Pastikan jalur ini benar
import { Container, Row, Col } from "react-bootstrap";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import "./Layout.css"; // Pastikan untuk mengimpor CSS Anda

const LayoutTemp = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="d-flex">
      {/* Sidebar with toggle button */}
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

      {/* Main content with space for sidebar */}
      <div
        className="main-content"
        style={{ marginLeft: isOpen ? "25px" : "60px" }}
      >
        <Container fluid>
          <Row>
            <Col>
              <Outlet />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default LayoutTemp;
