import IncomeCards from "../components/income/incomeCards";
import IncomeCategories from "../components/income/incomeCategories";
import IncomeForm from "../components/income/incomeForm";
import IncomeCharts from "../components/income/incomeCharts";
import "../components/income/income.css";

export default function Income() {
  return (
    <div className="income-page">
      <div className="income-header">
        <h1>Track Your Income</h1>
        <p>Manage all your income sources and monitor your financial growth.</p>
      </div>

      <IncomeCards />

      <IncomeCategories />

      <IncomeForm />

      <IncomeCharts />
    </div>
  );
}