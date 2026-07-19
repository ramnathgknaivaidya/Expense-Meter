import React from "react";

export function AnalyticsInsights() {
  const insights = [
    {
      icon: "📈",
      title: "Revenue momentum",
      value: "+18%",
      description: "Income improved across salary, freelance and investment channels.",
      color: "#10B981",
    },
    {
      icon: "💼",
      title: "Budget efficiency",
      value: "72%",
      description: "Expenses are running below the expected threshold, keeping overhead in check.",
      color: "#2563EB",
    },
    {
      icon: "🛡️",
      title: "Cash cushion",
      value: "4.2 months",
      description: "Your liquidity covers more than four months of fixed costs.",
      color: "#8B5CF6",
    },
    {
      icon: "💡",
      title: "Recommended action",
      value: "Allocate 12%",
      description: "Increase savings allocation by 12% to improve long-term reserves.",
      color: "#F59E0B",
    },
  ];

  return (
    <div className="insight-section">
      <div className="card-header" style={{ padding: 0, marginBottom: 20 }}>
        <h2>💡 Financial Insights</h2>
      </div>

      <div className="insight-grid">
        {insights.map((item, index) => (
          <div className="insight-card" key={index}>
            <div className="insight-info">
              <div>
                <h3>{item.title}</h3>
                <p className="insight-subtitle">{item.description}</p>
              </div>
              <div
                className="insight-icon"
                style={{
                  background: `${item.color}15`,
                  color: item.color,
                }}
              >
                {item.icon}
              </div>
            </div>
            <div className="insight-value">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnalyticsInsights;