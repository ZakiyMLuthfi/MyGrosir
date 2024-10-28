// Sidebar.jsx
import React from "react";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#343a40",
        color: "white",
        overflow: "hidden",
        width: isOpen ? "250px" : "0px",
        transition: "width 0.3s ease",
      }}
    >
      <div className="p-3 text-lg font-bold">MyGrosir</div>
      <ListGroup variant="flush">
        <ListGroup.Item
          as={Link}
          to="/dashboard"
          action
          className="list-group-item"
        >
          {isOpen ? "Dashboard" : ""}
        </ListGroup.Item>
        <ListGroup.Item
          as={Link}
          to="/products"
          action
          className="list-group-item"
        >
          {isOpen ? "Products" : ""}
        </ListGroup.Item>
        <ListGroup.Item
          as={Link}
          to="/suppliers"
          action
          className="list-group-item"
        >
          {isOpen ? "Suppliers" : ""}
        </ListGroup.Item>
        <ListGroup.Item
          as={Link}
          to="/stocks"
          action
          className="list-group-item"
        >
          {isOpen ? "Stocks" : ""}
        </ListGroup.Item>
        <ListGroup.Item
          as={Link}
          to="/stocks/stock-in"
          action
          className="list-group-item"
        >
          {isOpen ? "Stock-in" : ""}
        </ListGroup.Item>
        <ListGroup.Item
          as={Link}
          to="/stocks/stock-out"
          action
          className="list-group-item"
        >
          {isOpen ? "Stock-out" : ""}
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
};

export default Sidebar;
