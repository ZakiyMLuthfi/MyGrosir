// AddProduct.jsx
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";

const AddSupplier = ({ onSubmit }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    supplier_name: "",
    supplier_address: "",
    supplier_contact_name: "",
    supplier_contact: "",
    goods_type: [],
  });

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "goods_type") {
      const updatedGoodsType = formData.goods_type.includes(value)
        ? formData.goods_type.filter((type) => type !== value)
        : [...formData.goods_type, value];
      setFormData({ ...formData, goods_type: updatedGoodsType });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    handleClose();
    setFormData({
      supplier_name: "",
      supplier_address: "",
      supplier_contact_name: "",
      supplier_contact: "",
      goods_type: [],
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
          <Modal.Title>Add Supplier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="formSupplierName">
              <Form.Label>Supplier Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Add supplier name (required)"
                name="supplier_name"
                value={formData.product_name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formSupplierAddress">
              <Form.Label>Supplier Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Add supplier address (required)"
                name="supplier_address"
                value={formData.supplier_address}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formSupplierContactName">
              <Form.Label>Supplier Contact Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Add supplier contact name (required)"
                name="supplier_contact_name"
                value={formData.supplier_contact_name}
                onChange={handleInputChange}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="formSupplierContact">
              <Form.Label>Supplier Mobile Contact</Form.Label>
              <Form.Control
                type="text"
                placeholder="Add supplier mobile contact (required)"
                name="supplier_contact"
                value={formData.supplier_contact}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formGoodsType">
              <Form.Label>Goods Type</Form.Label>
              <div>
                <Form.Check
                  type="checkbox"
                  label="Sembako"
                  name="goods_type"
                  value="sembako"
                  checked={formData.goods_type.includes("sembako")}
                  onChange={handleInputChange}
                />
                <Form.Check
                  type="checkbox"
                  label="Makanan"
                  name="goods_type"
                  value="makanan"
                  checked={formData.goods_type.includes("makanan")}
                  onChange={handleInputChange}
                />
                <Form.Check
                  type="checkbox"
                  label="Minuman"
                  name="goods_type"
                  value="minuman"
                  checked={formData.goods_type.includes("minuman")}
                  onChange={handleInputChange}
                />
                <Form.Check
                  type="checkbox"
                  label="Barang"
                  name="goods_type"
                  value="barang"
                  checked={formData.goods_type.includes("barang")}
                  onChange={handleInputChange}
                />
              </div>
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

export default AddSupplier;
