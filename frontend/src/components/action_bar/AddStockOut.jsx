import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchSuppliers,
  fetchStockHistories,
} from "../../services/stockService";
import { getAuthHeader } from "../../utils/authService";
import axios from "axios";
import Select from "react-select";

const AddStockOut = ({ onAdd }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    supplierId: "",
    productId: "",
    quantity: "",
    grosir_choice: "",
    receipt_code: "",
  });
  const [existingReceiptCodes, setExistingReceiptCodes] = useState([]);
  const [isNewReceipt, setIsNewReceipt] = useState(false);

  const products = useSelector(
    (state) => state.inventory.products.products || []
  );
  const stockIns = useSelector((state) => state.inventory.stockIns || []);
  const updatedStockHistories = useSelector(
    (state) => state.inventory.stockHistories.stockHistories || []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProducts(null, null, dispatch, "", true);
        await fetchSuppliers(null, null, dispatch, "", true);
        await fetchStockHistories(null, null, dispatch, "", true);
        if (updatedStockHistories && updatedStockHistories.length > 0) {
          const codes = [
            ...new Set(
              updatedStockHistories.map((history) => history.receipt_code)
            ),
          ];
          setExistingReceiptCodes(codes);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [dispatch]);

  const generateReceiptCode = () => {
    if (!existingReceiptCodes || existingReceiptCodes.length === 0) {
      return "R0001";
    } else {
      const sortedCodes = existingReceiptCodes.sort((a, b) => {
        const numA = parseInt(a.substring(1), 10);
        const numB = parseInt(b.substring(1), 10);
        return numA - numB;
      });
      const lastCode = sortedCodes[sortedCodes.length - 1];
      const numberPart = parseInt(lastCode.substring(1), 10);
      return `R${(numberPart + 1).toString().padStart(4, "0")}`;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNewReceiptToggle = () => {
    setIsNewReceipt(!isNewReceipt);
    if (!isNewReceipt) {
      const newReceiptCode = generateReceiptCode();
      setFormData((prevData) => ({
        ...prevData,
        receipt_code: newReceiptCode,
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, receipt_code: "" }));
    }
  };

  const handleShow = async () => {
    setShowModal(true);
    try {
      await fetchProducts(null, null, dispatch, "", true);
      await fetchSuppliers(null, null, dispatch, "", true);
      await fetchStockHistories(null, null, dispatch, "", true);

      // Generate receipt code setelah data berhasil diambil
      setFormData({ ...formData, receipt_code: generateReceiptCode() });
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleClose = () => setShowModal(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const { productId, quantity, receipt_code, grosir_choice } = formData;
      const data = {
        productId: parseInt(productId, 10),
        totalReduction: parseInt(quantity, 10),
        receipt_code,
        grosir_choice,
      };

      const headers = getAuthHeader();
      const response = await axios.post(
        "http://localhost:5000/api/stocks/batch-reduce",
        data,
        { headers }
      );
      onAdd();
      console.log("Stock reduced successfully:", response.data);
      handleClose();
    } catch (error) {
      console.error("Error reducing stock in batch", error);
      if (error.response) {
        console.error("Error data:", error.response.data);
      }
    }
  };

  const getStockInfoForProduct = (productId) => {
    const relevantStockIns = stockIns.filter(
      (stockIn) =>
        stockIn.productId === productId && stockIn.quantity_remaining > 0
    );
    const totalQuantityRemaining = relevantStockIns.reduce(
      (total, stockIn) => total + stockIn.quantity_remaining,
      0
    );
    return totalQuantityRemaining;
  };

  // Transform products data into format required by react-select
  const productOptions = products
    .map((product) => {
      const totalQuantityRemaining = getStockInfoForProduct(product.id);
      return totalQuantityRemaining > 0
        ? {
            value: product.id,
            label: `${product.product_name} - Stock left: ${totalQuantityRemaining}`,
          }
        : null;
    })
    .filter((option) => option !== null);

  // Transform receipt codes into format required by react-select
  const receiptCodeOptions = existingReceiptCodes.map((code) => ({
    value: code,
    label: code,
  }));

  return (
    <>
      <Button
        variant="primary"
        onClick={handleShow}
        style={{ fontSize: "0.8rem" }}
      >
        <SendIcon />
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Send Stock Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="formProduct">
              <Form.Label>Product</Form.Label>
              <Select
                options={productOptions}
                onChange={(selectedOption) =>
                  setFormData({ ...formData, productId: selectedOption.value })
                }
                value={productOptions.find(
                  (option) => option.value === formData.productId
                )}
                placeholder="Select Product"
                isClearable
              />
            </Form.Group>

            <Form.Group controlId="formQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter quantity (required)"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formGrosirChoice">
              <Form.Label>Grosir Choice</Form.Label>
              <Form.Select
                name="grosir_choice"
                value={formData.grosir_choice || ""}
                onChange={handleInputChange}
                aria-label="Choose Grosir"
                required
              >
                <option value="">-Select Grosir-</option>
                <option value="Grosir A">Grosir A</option>
                <option value="Grosir B">Grosir B</option>
                <option value="Grosir C">Grosir C</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formReceiptCode">
              <Form.Label>Receipt Code</Form.Label>
              {isNewReceipt ? (
                <Form.Control
                  type="text"
                  name="receipt_code"
                  value={formData.receipt_code}
                  onChange={handleInputChange}
                  disabled
                />
              ) : (
                <Select
                  options={receiptCodeOptions}
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      receipt_code: selectedOption.value,
                    })
                  }
                  value={receiptCodeOptions.find(
                    (option) => option.value === formData.receipt_code
                  )}
                  placeholder="Select Existing Receipt Code"
                  isClearable
                />
              )}
            </Form.Group>

            <Form.Group controlId="formNewReceiptToggle">
              <Form.Check
                type="checkbox"
                label="Use new receipt code"
                checked={isNewReceipt}
                onChange={handleNewReceiptToggle}
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

export default AddStockOut;
