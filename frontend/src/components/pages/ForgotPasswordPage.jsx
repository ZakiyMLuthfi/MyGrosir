import React, { useState } from "react";
import axios from "axios";
import "../css/ForgotPasswordPage.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // Untuk menampilkan modal
  const [countdown, setCountdown] = useState(5); // Untuk countdown

  const startCountdown = () => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval); // Hentikan interval setelah countdown selesai
          setTimeout(() => {
            // Redirect ke halaman login setelah 5 detik
            window.location.href = "/login";
          }, 300); // Memberikan sedikit waktu sebelum redirect
        }
        return prev - 1;
      });
    }, 1000); // Setiap detik
  };

  // Fungsi untuk mengirim reset token
  const handleSendResetToken = async () => {
    if (isSending) return; // Mencegah pengiriman ulang sebelum delay berakhir

    setIsSending(true);
    setErrorMessage(""); // Reset error message
    try {
      await axios.post(
        "http://localhost:5000/api/users/request-reset-password",
        { email }
      );
      setSuccessMessage("Reset token has been sent to your email!");
    } catch (error) {
      setErrorMessage("Error sending reset token. Please try again.");
      console.error("Error sending reset token:", error);
    } finally {
      setTimeout(() => setIsSending(false), 3000);
    }
  };

  // Fungsi untuk memverifikasi reset token
  const handleVerifyToken = async () => {
    setErrorMessage(""); // Reset error message
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/verify-reset-token",
        { email, resetToken }
      );
      if (response.data.valid) {
        setShowPasswordForm(true); // Tampilkan form ganti password
      } else {
        setErrorMessage("Invalid or expired reset token!");
      }
    } catch (error) {
      setErrorMessage("Error verifying reset token. Please try again.");
      console.error("Error verifying reset token:", error);
    }
  };

  // Fungsi untuk mengubah password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/reset-password",
        { email, resetToken, newPassword }
      );

      if (newPassword.length <= 7) {
        setErrorMessage("Password must be at least 8 characters long.");
        return;
      }

      if (response.data.message === "Password has been reset successfully.") {
        setSuccessMessage("Your password has been successfully changed!");
        setShowPasswordForm(false);
        setEmail("");
        setResetToken("");
        setNewPassword("");
        setConfirmPassword("");

        setShowModal(true); // Tampilkan modal
        startCountdown(); // Mulai countdown
      } else {
        setErrorMessage("Error changing password. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Error changing password. Please try again.");
      console.error("Error changing password:", error);
    }
  };

  return (
    <div className="forgot-password__container">
      {!showPasswordForm ? (
        <>
          <h2 className="forgot-password__title">Forgot Password</h2>
          <div>
            <label className="forgot-password__form-label">Email:</label>
            <input
              className="forgot-password__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              className="forgot-password__button"
              onClick={handleSendResetToken}
              disabled={isSending}
            >
              Send Reset Token
            </button>
          </div>
          <div>
            <label className="forgot-password__form-label">Reset Token:</label>
            <input
              className="forgot-password__input"
              type="text"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              required
            />
            <button
              className="forgot-password__button"
              onClick={handleVerifyToken}
            >
              Verify Token
            </button>
          </div>
          {successMessage && (
            <p className="forgot-password__message">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="forgot-password__error-message">{errorMessage}</p>
          )}
        </>
      ) : (
        <>
          <h2 className="forgot-password__title">Reset Your Password</h2>
          <form onSubmit={handleChangePassword}>
            <label className="forgot-password__form-label">New Password:</label>
            <input
              className="forgot-password__input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <label className="forgot-password__form-label">
              Confirm New Password:
            </label>
            <input
              className="forgot-password__input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button className="forgot-password__button" type="submit">
              Change Password
            </button>
          </form>
          {errorMessage && (
            <p className="forgot-password__error-message">{errorMessage}</p>
          )}
        </>
      )}

      {showModal && (
        <div className="forgot-password__modal">
          <div className="forgot-password__modal-content">
            <h3>Your password has been successfully changed!</h3>
            <p>Redirecting to login in {countdown}...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
