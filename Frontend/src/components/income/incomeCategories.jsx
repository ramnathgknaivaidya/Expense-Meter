const categoryData = [
  { name: "Salary", amount: "₹1,20,000", trend: "+12%" },
  { name: "Freelance", amount: "₹35,000", trend: "+8%" },
  { name: "Investments", amount: "₹18,500", trend: "+5%" },
  { name: "Bonus", amount: "₹10,000", trend: "+2%" },
];

export default function IncomeCategories() {
  return (
    <section className="income-section">
      <h3>Income Categories</h3>
      <div className="category-list">
        {categoryData.map((category) => (
          <div key={category.name} className="category-item">
            <span>{category.name}</span>
            <strong>{category.amount}</strong>
            <span>{category.trend}</span>
          </div>
        ))}
      </div>
    </section>
  );
}