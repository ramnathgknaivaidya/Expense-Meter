import AnalyticsCards from "../components/analytics/analyticsCards";
import AnalyticsCharts from "../components/analytics/analyticsCharts";
import AnalyticsInsights from "../components/analytics/analyticsInsights";
import AnalyticsReport from "../components/analytics/analyticsReport";
import AnalyticsExport from "../components/analytics/analyticsExport";

import "../components/analytics/analytics.css";

export default function Analytics() { 
  return (
    <div className="page-body">
      <div className="analytics-page">

        <div className="analytics-header">
          <div className="analytics-header-copy">
            <span className="eyebrow">Personal finance analytics</span>
            <h1>Analytics Dashboard</h1>
            <p className="analytics-description">
              Review cash flow, savings momentum and budget efficiency with clean visuals, smart insights and export-ready reporting.
            </p>
          </div>
        </div>

        <div className="analytics-banner">
          <div>
            <p className="banner-label">This month at a glance</p>
            <h2>₹1,24,750 total revenue</h2>
            <p>
              Revenue increased 18% while expenses remained under 72% of income. Your savings runway is stronger than last month.
            </p>
          </div>

          <div className="banner-summary">
            <div>
              <span>Expense ratio</span>
              <strong>72%</strong>
            </div>
            <div>
              <span>Net savings</span>
              <strong>₹34,600</strong>
            </div>
            <div>
              <span>Cash runway</span>
              <strong>4.2 months</strong>
            </div>
          </div>
        </div>

        <AnalyticsCards />

        <AnalyticsCharts />

        <AnalyticsInsights />

        <AnalyticsReport />

        <AnalyticsExport />

      </div>
    </div>
  );
}