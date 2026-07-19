import React from "react";

export function AnalyticsExport() {
  const actions = [
    {
      title: "Download report",
      icon: "📄",
      color: "#2563EB",
      description: "Export the full analytics summary as a polished PDF.",
      buttonText: "Download PDF",
    },
    {
      title: "Export data",
      icon: "📊",
      color: "#16A34A",
      description: "Download transaction and budget data in CSV format.",
      buttonText: "Export CSV",
    },
    {
      title: "Share insights",
      icon: "📤",
      color: "#8B5CF6",
      description: "Send key metrics and charts to your finance team.",
      buttonText: "Share Now",
    },
    {
      title: "Print summary",
      icon: "🖨️",
      color: "#F59E0B",
      description: "Create a clean physical copy of your monthly report.",
      buttonText: "Print",
    },
  ];

  const handleClick = (title) => {
    alert(`${title} feature coming soon 🚀`);
  };

  return (
    <div className="export-section">
      <div className="card-header" style={{ padding: 0, marginBottom: 18 }}>
        <h2>📁 Export & Share</h2>
      </div>

      <div className="export-grid">
        {actions.map((item, index) => (
          <div
            key={index}
            className="export-card"
            onClick={() => handleClick(item.title)}
          >
            <div className="export-meta">
              <div
                className="export-icon"
                style={{
                  background: `${item.color}15`,
                  color: item.color,
                }}
              >
                {item.icon}
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>

            <button
              className="export-action"
              style={{
                background: item.color,
              }}
            >
              {item.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnalyticsExport;