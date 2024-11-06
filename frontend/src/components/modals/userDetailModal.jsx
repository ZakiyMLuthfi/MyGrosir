import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import formatDate from "../../utils/converter";

const UserDetailModal = ({ show, onClose, userData }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (userData) {
      setFormData(userData); // Mengatur formData saat userData berubah
    } else {
      setFormData({});
    }
  }, [userData]);

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              value={formData.username || ""}
              disabled
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="product_name"
              value={formData.email || ""}
              disabled
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Last update</Form.Label>
            <Form.Control
              name="updatedAt"
              value={formatDate(formData.updatedAt || "")}
              disabled
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetailModal;
