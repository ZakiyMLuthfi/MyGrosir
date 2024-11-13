import React, { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ErrorToast = ({ message, show, onClose }) => {
  return (
    <ToastContainer position="bottom-start" className="p-3">
      <Toast onClose={onClose} show={show} delay={3000} autohide bg="danger">
        <Toast.Header>
          <strong className="me-auto text-danger">Error</strong>
          <small>Just now</small>
        </Toast.Header>
        <Toast.Body className="text-white">{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ErrorToast;
