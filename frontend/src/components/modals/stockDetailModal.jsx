import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import moment from "moment-timezone";

const StockDetailModal = ({
  show,
  onClose,
  stockData,
  type = "",
  isEditing,
  onUpdate,
  onToggleEdit,
  users,
  role,
}) => {
  const [formData, setFormData] = useState({});
  const creator =
    (stockData && users.find((user) => user.id === stockData.created_by)) || {};

  const updater =
    (stockData && users.find((user) => user.id === stockData.updated_by)) || {};

  useEffect(() => {
    if (stockData) {
      setFormData(stockData); // Mengatur formData sesuai data yang diterima
    }
  }, [stockData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const formatDate = (dateString) => {
    return moment(dateString).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
  };

  const safeReplace = (value, search, replace) => {
    return typeof value === "string" ? value.replace(search, replace) : value;
  };

  const handleSaveChanges = () => {
    if (formData.quantity_reduction > formData.quantity_remaining) {
      alert("Reduction quantity cannot be greater than remaining quantity.");
      return;
    }
    onUpdate(formData);
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing
            ? `Update ${safeReplace(type, "-", " ")}`
            : `${safeReplace(type, "-", " ").toUpperCase()}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Common Fields */}
          <Form.Group>
            <Form.Label>Stock Code</Form.Label>
            <Form.Control
              name="stock_code"
              value={formData.stock_code || ""}
              disabled
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Supplier</Form.Label>
            <div style={{ display: "flex", gap: "10px" }}>
              <Form.Control
                name="supplierCode"
                disabled
                value={formData.supplier?.supplier_code || ""}
                style={{ flex: "2" }}
              />
              <Form.Control
                name="supplierName"
                disabled
                value={formData.supplier?.supplier_name || ""}
                style={{ flex: "12" }}
              />
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Label>Product</Form.Label>
            <div style={{ display: "flex", gap: "10px" }}>
              <Form.Control
                name="productCode"
                disabled
                value={formData.product?.product_code || ""}
                style={{ flex: "2" }}
              />
              <Form.Control
                name="productName"
                disabled
                value={formData.product?.product_name || ""}
                style={{ flex: "12" }}
              />
            </div>
          </Form.Group>

          {/* Conditional Fields Based on Type */}
          {type === "stock-in" && (
            <>
              <Form.Group>
                <Form.Label>Quantity (pack) / Quantity Remaining</Form.Label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Form.Control
                    name="quantity"
                    disabled
                    type="number"
                    value={formData.quantity || ""}
                  />
                  <Form.Control
                    name="quantity_remaining"
                    type="number"
                    disabled={!isEditing}
                    value={formData.quantity_remaining || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </Form.Group>

              <Form.Group>
                <Form.Label>Purchase Price / Total Purchase Price </Form.Label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Form.Control
                    name="purchase_price"
                    disabled
                    value={formData.purchase_price || ""}
                  />
                  <Form.Control
                    name="total_purchase_price"
                    disabled
                    value={formData.total_purchase_price || ""}
                  />
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label>Author</Form.Label>
                <Form.Control
                  name="created_by"
                  value={creator.username || ""}
                  disabled
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Create Date / Last Update </Form.Label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Form.Control
                    name="createdAt"
                    value={formatDate(formData.createdAt || "")}
                    disabled
                  />
                  <Form.Control
                    name="updatedAt"
                    disabled
                    value={formatDate(formData.updatedAt || "")}
                  />
                </div>
              </Form.Group>
            </>
          )}

          {type === "stock-out" && (
            <>
              <Form.Group>
                <Form.Label>Quantity (pack) / Quantity Remaining</Form.Label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Form.Control
                    name="quantity"
                    disabled
                    value={formData.quantity || ""}
                  />
                  <Form.Control
                    name="quantity_remaining"
                    disabled
                    value={formData.quantity_remaining || ""}
                  />
                </div>
              </Form.Group>
              {/* <Form.Group>
                <Form.Label>
                  Enter amount of stocks & Grosir destination
                </Form.Label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Form.Control
                    name="quantity_reduction"
                    type="number"
                    value={formData.quantity_reduction || ""}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                  />
                  <Form.Select
                    name="grosir_choice"
                    disabled={!isEditing}
                    value={formData.grosir_choice || ""}
                    onChange={handleInputChange}
                    aria-label="Destination"
                  >
                    <option>-Select Grosir-</option>
                    <option value="Grosir A">Grosir A</option>
                    <option value="Grosir B">Grosir B</option>
                    <option value="Grosir C">Grosir C</option>
                  </Form.Select>
                </div>
              </Form.Group> */}
              <Form.Group>
                <Form.Label>Updated at / Updated by: </Form.Label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Form.Control
                    name="updatedAt"
                    value={formatDate(formData.updatedAt || "")}
                    disabled
                  />
                  <Form.Control
                    name="updated_by"
                    disabled
                    value={updater ? updater.username : ""}
                  />
                </div>
              </Form.Group>
              <Form.Group></Form.Group>
            </>
          )}
          {type === "stock-history" && (
            <>
              <Form.Group>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  name="quantity"
                  value={formData.quantity || ""}
                  disabled
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Stock Price</Form.Label>
                <Form.Control
                  name="stock_price"
                  value={formData.stock_price || ""}
                  disabled
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Send to</Form.Label>
                <Form.Control
                  name="grosir_choice"
                  value={formData.grosir_choice || ""}
                  disabled
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Create date / Author: </Form.Label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Form.Control
                    name="createdAt"
                    value={formatDate(formData.createdAt || "")}
                    disabled
                  />
                  <Form.Control
                    name="created_by"
                    value={creator ? creator.username : "" || ""}
                    disabled
                  />
                </div>
              </Form.Group>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        {/* {type === "stock-out" &&
          role === "admin" &&
          (!isEditing ? (
            <Button variant="primary" onClick={onToggleEdit}>
              Update
            </Button>
          ) : (
            <Button variant="success" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          ))} */}
      </Modal.Footer>
    </Modal>
  );
};

export default StockDetailModal;
