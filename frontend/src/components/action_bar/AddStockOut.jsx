import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchSuppliers,
  fetchStockIns,
  updateStockOut,
} from "../../services/stockService";
import { getAuthHeader } from "../../utils/authService";
import axios from "axios";

const AddStockOut = ({ onSubmit }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    supplierId: "",
    productId: "",
    quantity: "",
    grosir_choice: "",
    receipt_code: "", // Nomor resi
  });

  const [existingReceiptCodes, setExistingReceiptCodes] = useState([]);
  const [isNewReceipt, setIsNewReceipt] = useState(false); // Flag untuk menentukan apakah nomor resi baru

  const dispatch = useDispatch();

  const products = useSelector(
    (state) => state.inventory.products.products || []
  );
  const suppliers = useSelector(
    (state) => state.inventory.suppliers.suppliers || []
  );
  const stockIns = useSelector((state) => state.inventory.stockIns || []);
  const stockHistories = useSelector(
    (state) => state.inventory.stockHistories || []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProducts(dispatch);
        await fetchSuppliers(dispatch);
        const currentPage = 1; // Atau sesuai dengan kebutuhan Anda
        const itemsPerPage = 10; // Atau sesuai dengan kebutuhan Anda

        // Memanggil fetchStockIns
        await fetchStockIns(currentPage, itemsPerPage, dispatch);

        // Ambil semua nomor resi yang ada dari stockHistories
        const codes = [
          ...new Set(stockHistories.map((history) => history.receipt_code)),
        ];
        setExistingReceiptCodes(codes);
      } catch (err) {
        console.error(
          "Error fetching products, suppliers, or receipt codes",
          err
        );
      }
    };
    fetchData();
  }, [dispatch, stockHistories]);

  const generateReceiptCode = () => {
    if (stockHistories.length === 0) {
      return "R0001";
    } else {
      const lastHistory = stockHistories[stockHistories.length - 1];
      const lastCode = lastHistory.receipt_code || "R0000";
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
    setIsNewReceipt(!isNewReceipt); // Toggle antara resi baru dan resi yang ada
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

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Ambil data dari form
      const { productId, quantity, receipt_code, grosir_choice } = formData;

      // Data yang dikirim ke backend, pastikan productId dan quantity adalah integer
      const data = {
        productId: parseInt(productId, 10), // Convert productId to integer
        totalReduction: parseInt(quantity, 10), // Convert quantity to integer
        receipt_code,
        grosir_choice,
      };

      // Header dengan token otorisasi
      const headers = getAuthHeader();
      console.log("Data sent to backend:", data);

      // Kirim request ke backend menggunakan /batch-reduce
      const response = await axios.post(
        "http://localhost:5000/api/stocks/batch-reduce",
        data,
        { headers }
      );

      // Log respons yang berhasil
      console.log("Stock reduced successfully:", response.data);

      // Jika berhasil, tutup modal dan panggil onSubmit
      onSubmit(data);
      handleClose();
    } catch (error) {
      // Tangani error dari permintaan
      console.error("Error reducing stock in batch", error);

      // Tangani jika error berasal dari respons backend
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
              <Form.Control
                as="select"
                name="productId"
                value={formData.productId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Product</option>
                {products.map((product) => {
                  const totalQuantityRemaining = getStockInfoForProduct(
                    product.id
                  );
                  if (totalQuantityRemaining > 0) {
                    return (
                      <option key={product.id} value={product.id}>
                        {product.product_name} - Stok Tersisa:{" "}
                        {totalQuantityRemaining}
                      </option>
                    );
                  }
                  return null; // Jangan tampilkan produk dengan stok kosong
                })}
              </Form.Control>
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
                <Form.Control
                  as="select"
                  name="receipt_code"
                  value={formData.receipt_code}
                  onChange={handleInputChange}
                >
                  <option value="">Select Existing Receipt Code</option>
                  {existingReceiptCodes.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </Form.Control>
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
