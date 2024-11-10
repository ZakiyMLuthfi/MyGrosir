// AddUser.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";

const AddUser = ({ onSubmit, role }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: role === "supervisor" ? "admin" : "supervisor",
  });

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    if (role === "superadmin") {
      setFormData((prevData) => ({
        ...prevData,
        role: "supervisor", // Set default role untuk superadmin
      }));
    } else if (role === "supervisor") {
      setFormData((prevData) => ({
        ...prevData,
        role: "admin", // Set default role untuk supervisor
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        role: "", // Set role menjadi kosong untuk user biasa
      }));
    }
  }, [role]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Selected role:", formData.role);

    if (!["admin", "supervisor"].includes(formData.role)) {
      alert("Invalid role selected");
      return;
    }
    onSubmit(formData);
    handleClose();
    setFormData({
      username: "",
      email: "",
      role: role === "supervisor" ? "admin" : "supervisor",
    });
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={handleShow}
        style={{ fontSize: "0.8rem" }}
      >
        <AddIcon />
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {role === "superadmin"
              ? "Add Supervisor"
              : role === "supervisor"
              ? "Add Admin"
              : "Add User"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username (required)"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter email (required)"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                disabled // Disable jika role adalah supervisor atau superadmin
              >
                {/* Hanya tampilkan opsi jika role adalah admin atau superadmin */}
                {role !== "supervisor" && role !== "superadmin" && (
                  <>
                    <option value="admin">Admin</option>
                    <option value="supervisor">Supervisor</option>
                  </>
                )}
                {/* Set role otomatis berdasarkan siapa yang membuka modal */}
                {role === "supervisor" && <option value="admin">Admin</option>}
                {role === "superadmin" && (
                  <option value="supervisor">Supervisor</option>
                )}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddUser;
