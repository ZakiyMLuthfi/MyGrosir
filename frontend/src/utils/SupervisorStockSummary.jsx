import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const SupervisorStockSummary = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Mengambil data total stok masuk dan keluar
    const fetchSupervisorStockSummary = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/dashboard/supervisor-stock-summary"
        );

        // Data yang diterima dari backend
        const formattedData = [
          {
            name: "Total Stock In", // Label untuk Stok Masuk
            value: response.data.stockIn, // Jumlah stok yang masuk
          },
          {
            name: "Total Stock Out", // Label untuk Stok Keluar
            value: response.data.stockOut, // Jumlah stok yang keluar
          },
        ];
        setData(formattedData); // Menyimpan data ke state
      } catch (error) {
        console.error("Error fetching stock-in and stock-out data:", error);
      }
    };

    fetchSupervisorStockSummary();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />{" "}
        {/* Label sumbu X, Total Stock In / Stock Out */}
        <YAxis /> {/* Total jumlah stok pada sumbu Y */}
        <Tooltip /> {/* Menampilkan informasi saat hover */}
        <Legend /> {/* Menampilkan legenda */}
        <Bar dataKey="value" fill="#82ca9d" />{" "}
        {/* Grafik batang dengan nilai */}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SupervisorStockSummary;
