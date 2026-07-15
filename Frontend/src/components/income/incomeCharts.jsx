const chartData = [
  { month: "Jan", value: 42 },
  { month: "Feb", value: 58 },
  { month: "Mar", value: 70 },
  { month: "Apr", value: 64 },
  { month: "May", value: 82 },
];

export default function IncomeCharts() {
  return (
    <section className="income-section">
      <h3>Monthly Income Trend</h3>
      <div className="chart-bars">
        {chartData.map((item) => (
          <div key={item.month} className="chart-bar">
            <span style={{ height: `${item.value}%` }} />
            <small>{item.month}</small>
          </div>
        ))}
      </div>
    </section>
  );
}