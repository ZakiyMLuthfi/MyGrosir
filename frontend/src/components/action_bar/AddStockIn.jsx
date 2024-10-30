// AddProduct.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import { addStockInService } from "../../services/stockService";
import { fetchProducts } from "../../services/productService";
import { fetchSuppliers } from "../../services/supplierService";

const AddStockIn = ({ onSubmit }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    supplierId: "",
    productId: "",
    quantity: "",
    purchase_price: "",
  });
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const productData = await fetchProducts();
      const supplierData = await fetchSuppliers();
      setProducts(productData);
      setSuppliers(supplierData);
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const response = await addStockInService(formData);
    if (response) {
      onSubmit();
      handleClose();
      setFormData({
        supplierId: "",
        productId: "",
        quantity: "",
        purchase_price: "",
      });
    }
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
          <Modal.Title>Add Stock-in</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="formSupplier">
              <Form.Label>Supplier</Form.Label>
              <Form.Control
                as="select"
                name="supplierId"
                value={formData.supplierId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.supplier_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formProduct">
              <Form.Label>Product</Form.Label>
              <Form.Control
                as="select"
                name="productId"
                value={formData.productId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.product_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPurchasePrice">
              <Form.Label>Purchase Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter purchase price"
                name="purchase_price"
                value={formData.purchase_price}
                onChange={handleInputChange}
                required
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

export default AddStockIn;
