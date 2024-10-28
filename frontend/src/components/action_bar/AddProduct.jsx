// AddProduct.jsx
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";

const AddProduct = ({ onSubmit }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    product_name: "",
    package_quantity: "",
    weight_type: "kilogram",
    weight_per_pkg: "",
    description: "",
  });

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    handleClose();
    setFormData({
      product_name: "",
      package_quantity: "",
      weight_type: "kilogram",
      weight_per_pkg: "",
      description: "",
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
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="formProductName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                name="product_name"
                value={formData.product_name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPackageQuantity">
              <Form.Label>Package Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter package quantity"
                name="package_quantity"
                value={formData.package_quantity}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formWeightType">
              <Form.Label>Weight Type</Form.Label>
              <Form.Control
                as="select"
                name="weight_type"
                value={formData.weight_type}
                onChange={handleInputChange}
              >
                <option value="kilogram">Kilogram</option>
                <option value="gram">Gram</option>
                <option value="liter">Liter</option>
                <option value="ml">Ml</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formWeightPerPkg">
              <Form.Label>Weight Per Package</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter weight per package"
                name="weight_per_pkg"
                value={formData.weight_per_pkg}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
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

export default AddProduct;
