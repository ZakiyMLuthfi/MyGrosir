import React, { useState } from "react";
import { ListGroup, Accordion } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // Pastikan ini terhubung

const Sidebar = ({ isOpen }) => {
  const [openStocks, setOpenStocks] = useState(false);

  const toggleStocks = () => {
    setOpenStocks((prev) => !prev);
  };

  return (
    <div>
      <div className="p-3 text-lg font-bold sidebar-title">MyGrosir</div>
      <ListGroup variant="flush">
        <ListGroup.Item
          as={Link}
          to="/dashboard"
          action
          className="sidebar-item"
        >
          {isOpen ? "Dashboard" : ""}
        </ListGroup.Item>
        <ListGroup.Item
          as={Link}
          to="/products"
          action
          className="sidebar-item"
        >
          {isOpen ? "Products" : ""}
        </ListGroup.Item>
        <ListGroup.Item
          as={Link}
          to="/suppliers"
          action
          className="sidebar-item"
        >
          {isOpen ? "Suppliers" : ""}
        </ListGroup.Item>
        <Accordion>
          <ListGroup.Item
            action
            className="sidebar-item"
            onClick={toggleStocks}
          >
            {isOpen ? "Stocks" : ""}
          </ListGroup.Item>
          <Accordion.Collapse in={openStocks}>
            <ListGroup variant="flush">
              <ListGroup.Item
                as={Link}
                to="/stocks/stock-in"
                className="sidebar-item"
              >
                {isOpen ? "Stock-in" : ""}
              </ListGroup.Item>
              <ListGroup.Item
                as={Link}
                to="/stocks/stock-out"
                className="sidebar-item"
              >
                {isOpen ? "Stock-out" : ""}
              </ListGroup.Item>
              <ListGroup.Item
                as={Link}
                to="/stocks/stock-history"
                className="sidebar-item"
              >
                {isOpen ? "Stock History" : ""}
              </ListGroup.Item>
            </ListGroup>
          </Accordion.Collapse>
        </Accordion>
      </ListGroup>
    </div>
  );
};

export default Sidebar;
