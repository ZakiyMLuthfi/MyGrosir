import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { clearToken } from "../reducers/userActions";

const CheckStatus = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return; // Tidak melakukan pengecekan jika token tidak ada (user belum login)
    }

    const interval = setInterval(async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/status",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (response.data.status === "deactivated") {
          const res = await fetch("http://localhost:5000/api/users/logout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });
          // Jika pengguna dinonaktifkan, logout pengguna
          console.log("User has been deactivated. Logging out...");
          dispatch(clearToken());
          localStorage.removeItem("accessToken");
          localStorage.removeItem("accessRole");
          localStorage.removeItem("loggedInUserId");
          navigate("/login"); // Alihkan ke halaman login
        }
      } catch (error) {
        console.error("Error checking user status:", error.message);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [dispatch, navigate]);

  return null;
};

export default CheckStatus;
