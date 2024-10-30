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
}) => {
  const [formData, setFormData] = useState({
    // productName: "",
    // supplierName: ""
  });

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
            <Form.Label>Supplier Code</Form.Label>
            <Form.Control
              name="supplierCode"
              value={formData.supplier?.supplier_code || ""}
              disabled
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Supplier Name</Form.Label>
            <Form.Control
              name="supplierName"
              value={formData.supplier?.supplier_name || ""}
              disabled={!isEditing}
              onChange={isEditing ? handleInputChange : undefined}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Product Code</Form.Label>
            <Form.Control
              name="productCode"
              value={formData.product?.product_code || ""}
              disabled
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              name="productName"
              value={formData.product?.product_name || ""}
              disabled={!isEditing}
              onChange={isEditing ? handleInputChange : undefined}
            />
          </Form.Group>

          {/* Conditional Fields Based on Type */}
          {type === "stock-in" && (
            <>
              <Form.Group>
                <Form.Label>Quantity / Quantity Remaining</Form.Label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Form.Label>Quantity</Form.Label>
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
              <Form.Group>
                <Form.Label>Purchase Price</Form.Label>
                <Form.Control
                  name="purchase_price"
                  type="number"
                  disabled
                  value={formData.purchase_price || ""}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Total Purchase Price</Form.Label>
                <Form.Control
                  name="total_purchase_price"
                  type="number"
                  disabled
                  value={formData.total_purchase_price || ""}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Created by:</Form.Label>
                <Form.Control
                  name="created_by"
                  value={formData.created_by || ""}
                  disabled
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Created at / Updated at: </Form.Label>
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
                <Form.Label>Quantity / Quantity Remaining</Form.Label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    name="quantity"
                    disabled
                    value={formData.quantity || ""}
                  />
                  <Form.Control
                    name="quantity_remaining"
                    disabled={!isEditing}
                    value={formData.quantity_remaining || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label>Send to</Form.Label>
                <div>
                  <Form.Control
                    name="grosir_choice"
                    disabled={!isEditing}
                    value={formData.grosir_choice || ""}
                    onChange={handleInputChange}
                  >
                    <Form.Select aria-label="Destination">
                      <option>-Which Grosir-</option>
                      <option value="Grosir A">Grosir A</option>
                      <option value="Grosir B">Grosir B</option>
                      <option value="Grosir C">Grosir C</option>
                    </Form.Select>
                  </Form.Control>
                </div>
              </Form.Group>

              {/* <Form.Control
                  name="grosir_choice"
                  disabled={!isEditing}
                  value={formData.grosir_choice || ""}
                  onChange={handleInputChange}
                /> */}

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
                    value={formData.updated_by || ""}
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
                <Form.Label>Created at / Created by: </Form.Label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Form.Control
                    name="createdAt"
                    value={formatDate(formData.createdAt || "")}
                    disabled
                  />
                  <Form.Control
                    name="created_by"
                    value={formData.created_by || ""}
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
        {!isEditing && type !== "stock-history" ? (
          <Button variant="primary" onClick={onToggleEdit}>
            Update
          </Button>
        ) : (
          <Button variant="success" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default StockDetailModal;
