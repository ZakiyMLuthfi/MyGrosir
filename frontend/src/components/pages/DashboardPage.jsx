import React, { useEffect } from "react";
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
  setStockFlowData,
} from "../../reducers/dashboardActions";
import { useDispatch, useSelector } from "react-redux";
import "../css/DashboardPage.css";

const DashboardPage = () => {
  const DEFAULT_URL = "http://localhost:5000/api";
  const dispatch = useDispatch();
  const totalAssets = useSelector((state) => state.inventory.totalAssets);
  const totalItems = useSelector((state) => state.inventory.totalItems);
  const totalOutgoing = useSelector((state) => state.inventory.totalOutgoing);
  const stockFlowData = useSelector((state) => state.inventory.stockFlowData);

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
        console.log("respon dari warehouse: ", warehouseResponse);
        console.log("angka dari total items: ", totalItems);

        const outgoingResponse = await axios.get(
          `${DEFAULT_URL}/dashboard/total-outgoing-items`
        );
        dispatch(setTotalOutgoing(outgoingResponse.data.totalOutgoing));

        const flowResponse = await axios.get(
          `${DEFAULT_URL}/dashboard/stock-flow`
        );
        console.log("flow response: ", flowResponse);

        dispatch(setStockFlowData(flowResponse.data.stockFlowData));
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Section for total stats */}
      <div className="stat-boxes">
        <div className="stat-box total-assets">
          <h2>Assets</h2>
          <p>{totalAssets}</p>
        </div>
        <div className="stat-box warehouse-items">
          <h2>Warehouse</h2>
          <p>{totalItems}</p>
        </div>
        <div className="stat-box outgoing-items">
          <h2>Stock out</h2>
          <p>{totalOutgoing}</p>
        </div>
      </div>

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
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardPage;
