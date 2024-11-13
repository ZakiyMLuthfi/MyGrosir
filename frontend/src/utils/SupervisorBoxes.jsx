// SupervisorBoxes.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../components/css/DashboardPage.css"; // Gaya CSS tambahan untuk tampilan kotak

const SupervisorBoxes = () => {
  const [performanceData, setPerformanceData] = useState({
    fastSellingProduct: { name: "Loading...", totalSold: 0 },
    avgStockDuration: { name: "Loading...", avgDuration: 0 },
    slowSellingProduct: { name: "Loading...", totalSold: 0 },
  });

  useEffect(() => {
    // Fungsi untuk mengambil data performa stok
    const fetchStockPerformance = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/dashboard/stock-performance"
        );
        setPerformanceData(response.data);
        console.log("response data adalah: ", response.data);
      } catch (error) {
        console.error("Error fetching stock performance data:", error);
      }
    };

    fetchStockPerformance();
  }, []);

  return (
    <div className="supervisor-boxes-container">
      {/* Kotak Produk Tercepat Terjual */}
      <div className="supervisor-box most-delivered">
        <h6>Most delivered</h6>
        <h5>{performanceData.fastSellingProduct.name}</h5>
        <h10>Delivered: {performanceData.fastSellingProduct.totalSold}</h10>
      </div>

      {/* Kotak Waktu Rata-rata Habisnya Stok */}
      <div className="supervisor-box avg-stock-duration">
        <h5>{performanceData.avgStockDuration.name}</h5>
        <h10>
          Most send in {performanceData.avgStockDuration.avgDuration} day
        </h10>
      </div>

      {/* Kotak Produk Paling Jarang Terjual */}
      <div className="supervisor-box rarely-sent">
        <h6>Rarely requested</h6>
        <h5>{performanceData.slowSellingProduct.name}</h5>
        <h10>Total sent: {performanceData.slowSellingProduct.totalSold}</h10>
      </div>
    </div>
  );
};

export default SupervisorBoxes;
