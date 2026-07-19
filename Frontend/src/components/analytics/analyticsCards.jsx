import React from "react";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const defaultIncome = [
  { id: "salary", amount: 82000 },
  { id: "freelance", amount: 18950 },
  { id: "investments", amount: 23700 },
];

const defaultExpenses = [
  { id: "rent", amount: 22500 },
  { id: "groceries", amount: 12300 },
  { id: "transport", amount: 7350 },
  { id: "dining", amount: 7640 },
  { id: "subscriptions", amount: 4200 },
  { id: "shopping", amount: 21060 },
];

export default function AnalyticsCards({
  income = defaultIncome,
  expenses = defaultExpenses,
}) {
  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);

  const totalExpense = expenses.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const savings = totalIncome - totalExpense;

  const savingsRate =
    totalIncome > 0
      ? ((savings / totalIncome) * 100).toFixed(1)
      : 0;

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalIncome),
      desc: "All income sources combined",
      icon: "💼",
      color: "#2563EB",
      bgIcon: "rgba(37, 99, 235, 0.12)",
    },
    {
      title: "Total Expense",
      value: formatCurrency(totalExpense),
      desc: "Operational and lifestyle spend",
      icon: "💸",
      color: "#EF4444",
      bgIcon: "rgba(239, 68, 68, 0.12)",
    },
    {
      title: "Net Savings",
      value: formatCurrency(savings),
      desc: "Left after expenses",
      icon: "🟢",
      color: "#10B981",
      bgIcon: "rgba(16, 185, 129, 0.12)",
    },
    {
      title: "Savings Rate",
      value: `${savingsRate}%`,
      desc: "Share of income retained",
      icon: "🎯",
      color: "#F59E0B",
      bgIcon: "rgba(245, 158, 11, 0.12)",
    },
  ];

  return (
    <div className="analytics-cards">
      {cards.map((card, index) => (
        <div
          key={index}
          className="analytics-card"
          style={{
            borderTop: `4px solid ${card.color}`,
          }}
        >
          <div className="card-header" style={{ padding: 0, marginBottom: 12 }}>
            <span className="sc-label">{card.title}</span>
            <div
              className="sc-icon"
              style={{
                backgroundColor: card.bgIcon,
                color: card.color,
              }}
            >
              {card.icon}
            </div>
          </div>

          <h2 className="sc-value" style={{ marginTop: 0, fontSize: "1.9rem" }}>
            {card.value}
          </h2>

          <p style={{ color: "var(--text-secondary)", marginTop: 12, fontSize: "0.95rem" }}>
            {card.desc}
          </p>
        </div>
      ))}
    </div>
  );
}