// AddStockIn.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchSuppliers } from "../../services/stockService";

const AddStockIn = ({ onSubmit }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    supplierId: "",
    productId: "",
    quantity: "",
    purchase_price: "",
  });

  const dispatch = useDispatch();

  const products = useSelector((state) => {
    console.log("State products:", state.inventory.products);
    return state.inventory.products.products || [];
  });

  const suppliers = useSelector((state) => {
    console.log("State suppliers:", state.inventory.suppliers);
    return state.inventory.suppliers.suppliers || [];
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProducts(dispatch);
        await fetchSuppliers(dispatch);
      } catch (err) {
        console.error("Error fetching products or supplier", err);
      }
    };
    fetchData();
  }, [dispatch]);
  console.log(products, suppliers);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    handleClose();
    setFormData({
      supplierId: "",
      productId: "",
      quantity: "",
      purchase_price: "",
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
                {suppliers && suppliers.length > 0 ? (
                  suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.supplier_name}
                    </option>
                  ))
                ) : (
                  <option disabled>No Suppliers Available</option>
                )}
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
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.product_name}
                    </option>
                  ))
                ) : (
                  <option disabled>No Products Available</option>
                )}
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
              <Form.Label>Purchase Price (1 pkg)</Form.Label>
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
