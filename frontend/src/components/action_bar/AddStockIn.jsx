import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchSuppliers } from "../../services/stockService";
import Select from "react-select";

const AddStockIn = ({ onSubmit }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    supplierId: "",
    productId: "",
    quantity: "",
    purchase_price: "",
  });

  const dispatch = useDispatch();

  const products = useSelector(
    (state) => state.inventory.products.products || []
  );
  const suppliers = useSelector(
    (state) => state.inventory.suppliers.suppliers || []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProducts(null, null, dispatch, "", true);
        await fetchSuppliers(null, null, dispatch, "", true);
      } catch (err) {
        console.error("Error fetching products or suppliers", err);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: selectedOption ? selectedOption.value : "",
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

  // Convert products and suppliers to the format expected by react-select
  const supplierOptions = suppliers.map((supplier) => ({
    value: supplier.id,
    label: supplier.supplier_name,
  }));

  const productOptions = products.map((product) => ({
    value: product.id,
    label: product.product_name,
  }));

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
            {/* Supplier Dropdown with search */}
            <Form.Group controlId="formSupplier">
              <Form.Label>Supplier</Form.Label>
              <Select
                options={supplierOptions}
                value={supplierOptions.find(
                  (option) => option.value === formData.supplierId
                )}
                onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, "supplierId")
                }
                placeholder="Search Supplier"
                isClearable
              />
            </Form.Group>

            {/* Product Dropdown with search */}
            <Form.Group controlId="formProduct">
              <Form.Label>Product</Form.Label>
              <Select
                options={productOptions}
                value={productOptions.find(
                  (option) => option.value === formData.productId
                )}
                onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, "productId")
                }
                placeholder="Search Product"
                isClearable
              />
            </Form.Group>

            {/* Quantity Input */}
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

            {/* Purchase Price Input */}
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
