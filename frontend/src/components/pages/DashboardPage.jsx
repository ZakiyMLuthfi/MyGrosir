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
import "../css/DashboardPage.css";

const DashboardPage = () => {
  const DEFAULT_URL = "http://localhost:5000/api";
  const dispatch = useDispatch();
  const [isSuperAdminView, setIsSuperAdminView] = useState(false);
  const role = useSelector((state) => state.inventory.role);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assetsResponse = await axios.get(
          `${DEFAULT_URL}/dashboard/total-assets`
        );
        dispatch(setTotalAssets(assetsResponse.data.totalAssets));

        const warehouseResponse = await axios.get(
          `${DEFAULT_URL}/dashboard/total-warehouse-items`
        );
        dispatch(setTotalItems(warehouseResponse.data.totalItems));

        const outgoingResponse = await axios.get(
          `${DEFAULT_URL}/dashboard/total-outgoing-items`
        );
        dispatch(setTotalOutgoing(outgoingResponse.data.totalOutgoing));

        const incomingResponse = await axios.get(
          `${DEFAULT_URL}/dashboard/total-incoming-items`
        );
        dispatch(setTotalIncoming(incomingResponse.data.totalIncoming));

        const flowResponse = await axios.get(
          `${DEFAULT_URL}/dashboard/stock-flow`
        );

        const formattedData = flowResponse.data.stockFlowData.map((entry) => {
          const date = new Date(entry.date);
          if (isNaN(date.getTime())) {
            // Tanggal tidak valid
            return { ...entry, date: "Invalid Date" };
          }
          return { ...entry, date: date.toISOString().slice(0, 10) };
        });

        dispatch(setStockFlowData(formattedData));

        const historyResponse = await axios.get(
          `${DEFAULT_URL}/dashboard/recent-stock-history`
        );
        console.log("Recent Stock History:", historyResponse.data.history);
        dispatch(setRecentStockHistory(historyResponse.data.history));
        console.log("Updated Recent Stock History:", recentStockHistory);

        const lowStockResponse = await axios.get(
          `${DEFAULT_URL}/dashboard/low-stock-notifications`
        );
        console.log(
          "Low Stock Notifications:",
          lowStockResponse.data.notifications
        );
        dispatch(setLowStockNotifications(lowStockResponse.data.notifications));
        console.log("Updated Low Stock Notifications:", lowStockNotifications);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchData();
  }, []); //dispatch

  const toggleView = () => setIsSuperAdminView(!isSuperAdminView);

  return (
    <div className="dashboard-container">
      {role === "superadmin" && (
        <button onClick={toggleView} className="toggle-view-button">
          Switch to {isSuperAdminView ? "Admin" : "SuperAdmin"} View
        </button>
      )}

      {/* Display components based on role */}
      {role === "superadmin" && isSuperAdminView ? (
        <div className="stat-box total-assets">
          <h2>Total Assets</h2>
          <p>{totalAssets}</p>
        </div>
      ) : (
        <div className="stat-boxes">
          {role !== "supervisor" && (
            <>
              <div className="stat-box incoming-items">
                <h2>Stock in</h2>
                <p>{totalIncoming}</p>
              </div>
              <div className="stat-box warehouse-items">
                <h2>Warehouse</h2>
                <p>{totalItems}</p>
              </div>
              <div className="stat-box outgoing-items">
                <h2>Stock out</h2>
                <p>{totalOutgoing}</p>
              </div>
            </>
          )}
          {role === "supervisor" && (
            <div className="stat-box total-assets">
              <h2>Total Assets</h2>
              <p>{totalAssets}</p>
            </div>
          )}
        </div>
      )}

      {/* Section for stock flow chart */}
      <div className="chart-container">
        <h2>Stock flows</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={stockFlowData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
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
      </div>

      {/* Section for recent stock history */}
      <div className="table-container">
        <h2>Recent Stock History</h2>
        <table className="stock-history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {recentStockHistory.map((entry, index) => (
              <tr key={index}>
                <td>{formatDate(entry.createdAt)}</td>
                <td>{entry.stock_code}</td>
                <td>{entry.quantity}</td>
                <td>{entry.grosir_choice}</td>
                <td>{entry.product_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section for low stock notifications */}
      <div className="table-container">
        <h2>Low Stock Notifications</h2>
        <table className="low-stock-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity Remaining</th>
            </tr>
          </thead>
          <tbody>
            {lowStockNotifications.slice(0, 10).map((notification, index) => (
              <tr key={index}>
                <td>{notification.product_name}</td>
                <td>{notification.quantity_remaining}</td>
                <td>{notification.supplier_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
