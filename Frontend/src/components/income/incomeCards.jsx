const summaryData = [
  {
    title: "Total Income",
    amount: "₹2,45,000",
    description: "Overall Earnings",
    color: "#22c55e",
  },
  {
    title: "Monthly Income",
    amount: "₹45,000",
    description: "Current Month",
    color: "#3b82f6",
  },
  {
    title: "Average Income",
    amount: "₹38,200",
    description: "Per Month",
    color: "#f59e0b",
  },
  {
    title: "Top Source",
    amount: "Salary",
    description: "75% Contribution",
    color: "#8b5cf6",
  },
];

export default function IncomeCards() {
  return (
    <div className="summary-grid">
      {summaryData.map((card, index) => (
        <div
          key={index}
          className="summary-card"
          style={{ borderTop: `5px solid ${card.color}` }}
        >
          <h3>{card.title}</h3>
          <h2>{card.amount}</h2>
          <p>{card.description}</p>
        </div>
      ))}
    </div>
  );
}