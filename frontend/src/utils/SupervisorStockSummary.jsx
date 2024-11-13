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
  Text,
} from "recharts";
import axios from "axios";

const SupervisorStockSummary = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchSupervisorStockSummary = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/dashboard/supervisor-stock-summary"
        );

        // Data yang diterima dari backend
        const formattedData = [
          {
            name: "Total Stock In",
            total: response.data.stockIn,
            percentage: response.data.stockInPercentage,
          },
          {
            name: "Total Stock Out",
            total: response.data.stockOut,
            percentage: response.data.stockOutPercentage,
          },
        ];
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching stock-in and stock-out data:", error);
      }
    };

    fetchSupervisorStockSummary();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 30, right: 30, left: 20, bottom: 5 }} // Tambahkan margin atas
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="total"
          fill="#82ca9d"
          label={({ x, y, width, index }) => {
            // Menampilkan persentase dari data
            const percentage = data[index]?.percentage;
            const offset = 10;
            return (
              <Text
                x={x + width / 2}
                y={y - offset}
                fill="#000"
                textAnchor="middle"
                fontSize={12}
              >
                {`${percentage}%`}
              </Text>
            );
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SupervisorStockSummary;
