import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import moment from "moment-timezone";

const SupplierDetailModal = ({
  show,
  onClose,
  supplierData,
  isEditing,
  onUpdate,
  onToggleEdit,
}) => {
  const [formData, setFormData] = useState({});

  const selectedGoodsType = formData.goods_type || [];

  useEffect(() => {
    if (supplierData) {
      setFormData({
        ...supplierData,
        goods_type: Array.isArray(supplierData.goods_type)
          ? supplierData.goods_type
          : [],
      });
    }
  }, [supplierData]);

  const formatDate = (dateString) => {
    return moment(dateString).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;

    setFormData((prevData) => {
      if (name === "goods_type") {
        const updatedGoodsType = checked
          ? [...prevData.goods_type, value]
          : prevData.goods_type.filter((type) => type !== value); // Hapus nilai jika tidak dicentang

        return { ...prevData, goods_type: updatedGoodsType };
      } else {
        return {
          ...prevData,
          [name]: value,
        };
      }
    });
  };

  const handleSaveChanges = () => {
    onUpdate(formData);
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? "Update Supplier" : supplierData?.supplier_name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Supplier Code</Form.Label>
            <Form.Control
              name="supplier_code"
              value={formData.supplier_code || ""}
              disabled
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Supplier Name</Form.Label>
            <Form.Control
              name="supplier_name"
              value={formData.supplier_name || ""}
              disabled
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Supplier Address</Form.Label>
            <Form.Control
              name="supplier_address"
              disabled={!isEditing}
              value={formData.supplier_address || ""}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Contact Name / Mobile Phone</Form.Label>
            <div style={{ display: "flex", gap: "10px" }}>
              <Form.Control
                name="supplier_contact_name"
                disabled={!isEditing}
                value={formData.supplier_contact_name}
                onChange={handleInputChange}
                readOnly={!isEditing}
                placeholder="Supplier Contact Name"
              />
              <Form.Control
                name="supplier_contact"
                type="number"
                disabled={!isEditing}
                value={formData.supplier_contact}
                onChange={handleInputChange}
                readOnly={!isEditing}
                placeholder="Supplier mobile contact"
              />
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Label>Goods Type</Form.Label>
            <div>
              <Form.Check
                type="checkbox"
                label="Sembako"
                name="goods_type"
                value="sembako"
                checked={selectedGoodsType.includes("sembako")}
                disabled={!isEditing}
                onChange={handleInputChange}
              />
              <Form.Check
                type="checkbox"
                label="Makanan"
                name="goods_type"
                value="makanan"
                checked={selectedGoodsType.includes("makanan")}
                disabled={!isEditing}
                onChange={handleInputChange}
              />
              <Form.Check
                type="checkbox"
                label="Minuman"
                name="goods_type"
                value="minuman"
                checked={selectedGoodsType.includes("minuman")}
                disabled={!isEditing}
                onChange={handleInputChange}
              />
              <Form.Check
                type="checkbox"
                label="Barang"
                name="goods_type"
                value="barang"
                checked={selectedGoodsType.includes("barang")}
                disabled={!isEditing}
                onChange={handleInputChange}
              />
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Label>Author</Form.Label>
            <Form.Control
              name="created_by"
              value={formData.created_by || ""}
              disabled
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Create date</Form.Label>
            <Form.Control
              name="createdAt"
              value={formatDate(formData.createdAt || "")}
              disabled
              onChange={handleInputChange}
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

export default SupplierDetailModal;
