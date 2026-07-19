import React from "react";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function AnalyticsReport() {
  const totalIncome = 124750;
  const totalExpense = 90150;

  const savings = totalIncome - totalExpense;

  const savingsRate = (
    (savings / totalIncome) *
    100
  ).toFixed(1);

  const report = [
    {
      title: "Monthly Income",
      value: formatCurrency(totalIncome),
      icon: "💰",
      color: "#10B981",
      progress: 100,
      note: "21% above budget target",
    },
    {
      title: "Monthly Expense",
      value: formatCurrency(totalExpense),
      icon: "💸",
      color: "#EF4444",
      progress: 72,
      note: "72% of monthly income used",
    },
    {
      title: "Net Savings",
      value: formatCurrency(savings),
      icon: "📈",
      color: "#3B82F6",
      progress: 28,
      note: "Strong surplus this month",
    },
    {
      title: "Savings Rate",
      value: `${savingsRate}%`,
      icon: "🎯",
      color: "#F59E0B",
      progress: savingsRate,
      note: "Healthy cash retention",
    },
  ];

  return (
    <div>

      <div
        className="card-header"
        style={{ padding: 0, marginBottom: 18 }}
      >
        <h2>📄 Monthly Financial Report</h2>
      </div>

      <div className="report-grid">

        {report.map((item, index) => (

          <div
            key={index}
            className="report-card"
          >

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >

              <h4>{item.title}</h4>

              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: `${item.color}15`,
                  fontSize: "1.3rem",
                }}
              >
                {item.icon}
              </div>

            </div>

            <h2
              style={{
                color: item.color,
              }}
            >
              {item.value}
            </h2>

            <p>{item.note}</p>

            <div
              style={{
                marginTop: 18,
              }}
            >

              <div
                style={{
                  height: 8,
                  background: "#ECECEC",
                  borderRadius: 50,
                  overflow: "hidden",
                }}
              >

                <div
                  style={{
                    width: `${item.progress}%`,
                    height: "100%",
                    background: item.color,
                    borderRadius: 50,
                  }}
                />

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}