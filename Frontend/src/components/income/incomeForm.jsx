export default function IncomeForm() {
  return (
    <section className="income-section">
      <h3>Add Income</h3>
      <form className="income-form">
        <input type="text" placeholder="Source" />
        <input type="number" placeholder="Amount" />
        <select>
          <option>Salary</option>
          <option>Freelance</option>
          <option>Investment</option>
          <option>Bonus</option>
        </select>
        <input type="date" />
        <button type="button">Save Income</button>
      </form>
    </section>
  );
}