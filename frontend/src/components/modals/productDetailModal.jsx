import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import moment from "moment-timezone";

const ProductDetailModal = ({
  show,
  onClose,
  productData,
  isEditing,
  onUpdate,
  onToggleEdit,
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (productData) {
      setFormData(productData); // Mengatur formData saat productData berubah
    }
  }, [productData]);

  const formatDate = (dateString) => {
    return moment(dateString).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    onUpdate(formData);
  };

  const displayWeight = (weight) => {
    if (weight === undefined || weight === null) {
      return 0;
    }
    return Math.round(parseFloat(weight)) || 0;
  };
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? "Update Product" : productData?.product_name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Product Code</Form.Label>
            <Form.Control
              name="product_code"
              value={formData.product_code || ""}
              disabled
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              name="product_name"
              value={formData.product_name || ""}
              disabled
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Package Quantity</Form.Label>
            <Form.Control
              name="package_quantity"
              type="number"
              disabled={!isEditing}
              value={formData.package_quantity || ""}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Weight / Weight per pkg / Weight type</Form.Label>
            <div style={{ display: "flex", gap: "10px" }}>
              <Form.Control
                name="weight"
                type="number"
                disabled
                value={displayWeight(formData.weight)}
                onChange={handleInputChange}
                placeholder="Weight"
              />
              <Form.Control
                name="weight_per_pkg"
                type="number"
                disabled={!isEditing}
                value={displayWeight(formData.weight_per_pkg)}
                onChange={handleInputChange}
                readOnly={!isEditing}
                placeholder="Weight per pkg"
              />
              <Form.Control
                name="weight_type"
                disabled
                value={formData.weight_type}
                onChange={handleInputChange}
                placeholder="Weight type"
              />
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              disabled={!isEditing}
              value={formData.description || ""}
              onChange={handleInputChange}
              readOnly={!isEditing}
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
            <Form.Label>Created at:</Form.Label>
            <Form.Control
              name="createdAt"
              value={formatDate(formData.createdAt || "")}
              disabled
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        {!isEditing ? (
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

export default ProductDetailModal;
