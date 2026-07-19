import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";

const monthlyData = [
  { month: "Jan", income: 82000, expense: 56000 },
  { month: "Feb", income: 91000, expense: 61000 },
  { month: "Mar", income: 98500, expense: 68000 },
  { month: "Apr", income: 104000, expense: 73500 },
  { month: "May", income: 112500, expense: 81000 },
  { month: "Jun", income: 124750, expense: 90150 },
];

const categoryData = [
  { name: "Housing", value: 22500 },
  { name: "Groceries", value: 12300 },
  { name: "Transport", value: 7350 },
  { name: "Lifestyle", value: 21060 },
  { name: "Subscriptions", value: 4200 },
];

const COLORS = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

export function AnalyticsCharts() {
  return (
    <div className="analytics-chart-wrapper">

      {/* Full Width Bar Chart */}

      <div className="analytics-chart-card">
        <h3>📊 Income vs Expense Comparison</h3>

        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="income"
              fill="#10B981"
              radius={[8,8,0,0]}
            />

            <Bar
              dataKey="expense"
              fill="#EF4444"
              radius={[8,8,0,0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="analytics-bottom-grid">

        {/* Pie Chart */}

        <div className="analytics-chart-card">

          <h3>🥧 Spending Breakdown</h3>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>

              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >

                {categoryData.map((item,index)=>(
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}

              </Pie>

              <Tooltip/>

              <Legend/>

            </PieChart>
          </ResponsiveContainer>

        </div>

        {/* Line Chart */}

        <div className="analytics-chart-card">

          <h3>📈 Monthly Trend</h3>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthlyData}>

              <CartesianGrid strokeDasharray="3 3"/>

              <XAxis dataKey="month"/>

              <YAxis/>

              <Tooltip/>

              <Legend/>

              <Line
                dataKey="income"
                stroke="#10B981"
                strokeWidth={3}
              />

              <Line
                dataKey="expense"
                stroke="#EF4444"
                strokeWidth={3}
              />

            </LineChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}

export default AnalyticsCharts;