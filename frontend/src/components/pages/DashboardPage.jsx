import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SupervisorStockSummary from "../../utils/SupervisorStockSummary";
import {
  setTotalAssets,
  setTotalItems,
  setTotalOutgoing,
  setTotalIncoming,
  setStockFlowData,
  setRecentStockHistory,
  setLowStockNotifications,
} from "../../reducers/dashboardActions";
import { useDispatch, useSelector } from "react-redux";
import formatDate from "../../utils/converter";
import ScrollToBottomButton from "./ScrollToBottomButton";
import "../css/DashboardPage.css";

const DashboardPage = () => {
  const DEFAULT_URL = "http://localhost:5000/api";
  const dispatch = useDispatch();
  const [isSuperAdminView, setIsSuperAdminView] = useState(false);
  const role = useSelector((state) => state.inventory.role);

  const [selectedRange, setSelectedRange] = useState("thisWeek");
  const totalAssets = useSelector((state) => state.inventory.totalAssets);

  const totalItems = useSelector((state) => state.inventory.totalItems);
  const totalOutgoing = useSelector((state) => state.inventory.totalOutgoing);
  const totalIncoming = useSelector((state) => state.inventory.totalIncoming);
  const stockFlowData = useSelector((state) => state.inventory.stockFlowData);
  const recentStockHistory = useSelector(
    (state) => state.inventory.recentStockHistory || []
  );
  const lowStockNotifications = useSelector(
    (state) => state.inventory.lowStockNotifications || []
  );

  // Format tanggal untuk tampilan di sumbu X grafik
  const formatDateX = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Filter data berdasarkan rentang waktu yang dipilih
  const filterDataByRange = (data, range) => {
    const today = new Date();
    let startDate;
    const days = [];

    switch (range) {
      case "thisWeek":
        const dayOfWeek = today.getDay();
        startDate = new Date(today);
        startDate.setDate(today.getDate() - dayOfWeek + 1); // Senin
        break;
      case "last7Days":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7); // 7 hari ke belakang
        break;
      case "last14Days":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 14); // 14 hari ke belakang
        break;
      case "last30Days":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30); // 30 hari ke belakang
        break;
      case "monthly":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1); // Awal bulan ini
        break;
      default:
        startDate = new Date(today); // Default ke hari ini
    }

    console.log("Start Date:", startDate);
    console.log("Original Data:", data);
    console.log("Filtering by range:", range);

    // Membuat array hari-hari dalam rentang waktu
    let currentDate = new Date(startDate);
    while (currentDate <= today) {
      days.push(currentDate.toLocaleDateString()); // Menambahkan hari ke array
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Menggabungkan data yang ada dengan hari-hari dalam rentang waktu
    const filteredData = days.map((day) => {
      const entry = data.find((entry) => {
        const entryDate = new Date(entry.date);
        return entryDate.toLocaleDateString() === day;
      });
      // Jika tidak ada data untuk hari tersebut, buat entri baru dengan totalRemaining 0
      return entry || { date: new Date(day), totalRemaining: 0 };
    });

    console.log("Filtered Data:", filteredData);

    return filteredData;
  };

  // Fetch data pengguna untuk peta ID ke nama
  useEffect(() => {
    const fetchUserNames = async () => {
      try {
        const response = await axios.get(`${DEFAULT_URL}/users`);
        const users = response.data.users;
        const userMap = {};
        users.forEach((user) => {
          userMap[user.id] = user.username;
        });
        // Setel peta pengguna jika Anda ingin menggunakannya
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    fetchUserNames();
  }, []);

  // Fetch data untuk dashboard
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gabungkan semua endpoint dalam satu permintaan
        const [
          assetsResponse,
          warehouseResponse,
          outgoingResponse,
          incomingResponse,
          flowResponse,
          historyResponse,
          lowStockResponse,
        ] = await Promise.all([
          axios.get(`${DEFAULT_URL}/dashboard/total-assets`),
          axios.get(`${DEFAULT_URL}/dashboard/total-warehouse-items`),
          axios.get(`${DEFAULT_URL}/dashboard/total-outgoing-items`),
          axios.get(`${DEFAULT_URL}/dashboard/total-incoming-items`),
          axios.get(`${DEFAULT_URL}/dashboard/stock-flow`),
          axios.get(`${DEFAULT_URL}/dashboard/recent-stock-history`),
          axios.get(`${DEFAULT_URL}/dashboard/low-stock-notifications`),
        ]);

        // Menyimpan data ke Redux
        dispatch(setTotalAssets(assetsResponse.data.totalAssets));
        dispatch(setTotalItems(warehouseResponse.data.totalItems));
        dispatch(setTotalOutgoing(outgoingResponse.data.totalOutgoing));
        dispatch(setTotalIncoming(incomingResponse.data.totalIncoming));

        // Format dan filter stock flow data sesuai rentang waktu yang dipilih
        const formattedData = flowResponse.data.stockFlowData.map((entry) => {
          const date = new Date(entry.date);
          const formattedDate = isNaN(date.getTime())
            ? null
            : date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              });
          return {
            ...entry,
            date: formattedDate,
          };
        });

        const filteredData = filterDataByRange(formattedData, selectedRange);
        dispatch(setStockFlowData(filteredData));

        // Menyimpan history dan low stock notifications ke Redux
        dispatch(setRecentStockHistory(historyResponse.data.history));
        dispatch(setLowStockNotifications(lowStockResponse.data.notifications));
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchData();
  }, [dispatch, selectedRange]);

  // Fungsi untuk mengubah rentang waktu
  const handleRangeChange = (e) => {
    setSelectedRange(e.target.value);
  };

  const toggleView = () => setIsSuperAdminView(!isSuperAdminView);

  console.log("Stock Flow Data from Redux:", stockFlowData);

  return (
    <div className="dashboard-container">
      {role === "superadmin" && (
        <button onClick={toggleView} className="toggle-view-button">
          Switch to {isSuperAdminView ? "Admin" : "Supervisor"} View
        </button>
      )}

      {/* Display components based on role or toggle for superadmin */}
      <div className="stat-boxes">
        {role === "admin" || (role === "superadmin" && !isSuperAdminView) ? (
          <>
            <div className="stat-box incoming-items">
              <h1>{totalIncoming}</h1>
              <h6>Stock in</h6>
            </div>
            <div className="stat-box warehouse-items">
              <h1>{totalItems}</h1>
              <h6>Warehouse</h6>
            </div>
            <div className="stat-box outgoing-items">
              <h1>{totalOutgoing}</h1>
              <h6>Stock out</h6>
            </div>
          </>
        ) : (
          <div className="stat-box total-assets">
            <h2>Total Assets</h2>
            <p>{totalAssets}</p>
          </div>
        )}
      </div>

      {/* Section for stock flow chart */}
      <div className="dashboard-layout">
        <div className="chart-container">
          {role === "admin" || (role === "superadmin" && !isSuperAdminView) ? (
            <>
              <h2>Trend Stocks</h2>
              <select value={selectedRange} onChange={handleRangeChange}>
                <option value="thisWeek">This Week</option>
                <option value="last7Days">Last 7 Days</option>
                <option value="last14Days">Last 14 Days</option>
                <option value="last30Days">Last 30 Days</option>
                <option value="monthly">Monthly</option>
              </select>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={stockFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatDateX} />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="totalRemaining"
                    name="Stocks in warehouse"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </>
          ) : (
            <>
              <h2>Supervisor Stock Summary</h2>
              <SupervisorStockSummary />
            </>
          )}
        </div>

        <div className="recent-history-container" style={{ width: "25%" }}>
          <h2>Recent History</h2>
          <table className="stock-history-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentStockHistory.map((entry, index) => {
                // Tentukan apakah data berasal dari "stock-in" atau "stock history"
                const isStockHistory = entry.grosir_choice === ""; // Pastikan kolom "source" sesuai dengan data Anda

                return (
                  <tr
                    key={index}
                    className={
                      isStockHistory ? "stock-in-row" : "stock-history-row"
                    }
                  >
                    <td>{entry.product_name}</td>
                    <td>{entry.quantity}</td>
                    <td>{formatDate(entry.date)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="low-stock-container">
          <h5>Low on stocks</h5>
          <table className="low-stock-table">
            <thead>
              <tr>
                <th>Code item</th>
                <th>Item</th>
                <th>Qty Left</th>
              </tr>
            </thead>
            <tbody>
              {lowStockNotifications.slice(0, 10).map((notification, index) => (
                <tr key={index}>
                  <td>{notification.product_code}</td>
                  <td>{notification.product_name}</td>
                  <td>{notification.quantity_remaining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ScrollToBottomButton />
    </div>
  );
};

export default DashboardPage;
