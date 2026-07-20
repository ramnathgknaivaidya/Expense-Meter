import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { IconFood, IconTransport, IconHousing, IconBills, IconShopping, IconHealthcare, IconEducation, IconEntertainment, IconTravel, IconFallback, IconCash, IconUpi, IconCard, IconBank, IconWallet, IconChartUp, IconChartDown, IconPiggy, IconTarget, IconGrowth, IconCalendar, IconPin, IconCrown, IconBolt, IconCheck, IconArrowRight, IconIncome, IconExpense, IconSalary, IconFreelance, IconBusiness, IconInvestment, IconBonus, IconBarChart } from '../utils/icons';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

const getCategoryIcon = (category) => {
  const cat = category.toLowerCase();
  if (cat.includes('salary') || cat.includes('job')) return <IconSalary size={14} />;
  if (cat.includes('freelance') || cat.includes('project')) return <IconFreelance size={14} />;
  if (cat.includes('business') || cat.includes('revenue')) return <IconBusiness size={14} />;
  if (cat.includes('invest') || cat.includes('dividend')) return <IconInvestment size={14} />;
  if (cat.includes('bonus') || cat.includes('gift')) return <IconBonus size={14} />;
  if (cat.includes('food') || cat.includes('eat')) return <IconFood size={14} />;
  if (cat.includes('transport') || cat.includes('cab') || cat.includes('fuel')) return <IconTransport size={14} />;
  if (cat.includes('housing') || cat.includes('rent')) return <IconHousing size={14} />;
  if (cat.includes('bill') || cat.includes('electricity')) return <IconBills size={14} />;
  if (cat.includes('shopping') || cat.includes('clothes')) return <IconShopping size={14} />;
  if (cat.includes('health') || cat.includes('medicine')) return <IconHealthcare size={14} />;
  if (cat.includes('education') || cat.includes('course')) return <IconEducation size={14} />;
  if (cat.includes('entertainment') || cat.includes('netflix')) return <IconEntertainment size={14} />;
  return <IconFallback size={14} />;
};

const getPaymentMethodIcon = (method) => {
  const m = method?.toLowerCase() || '';
  if (m.includes('cash')) return <IconCash size={14} />;
  if (m.includes('upi')) return <IconUpi size={14} />;
  if (m.includes('card')) return <IconCard size={14} />;
  if (m.includes('bank') || m.includes('transfer')) return <IconBank size={14} />;
  return <IconFallback size={14} />;
};

const COLORS = {
  income: ['#10b981', '#34d399', '#059669', '#6ee7b7', '#a7f3d0'],
  expense: ['#f97316', '#ef4444', '#f87171', '#fb923c', '#fca5a5', '#fdba74', '#fecaca', '#fed7aa'],
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('income');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0, savingsRate: 0, incomeGrowth: 0, expenseChange: 0, balanceChange: 0 });
  const [incomeAnalytics, setIncomeAnalytics] = useState({ monthlyIncome: 0, growthPercentage: 0, highestSource: 'N/A', sources: [] });
  const [expenseAnalytics, setExpenseAnalytics] = useState({ monthlyExpense: 0, highestCategory: 'N/A', spendingRate: 0, categories: [] });
  const [budgetStatus, setBudgetStatus] = useState({ budgets: [], summary: { totalBudget: 0, totalSpent: 0, totalRemaining: 0, overallPercentage: 0 } });
  const [transactions, setTransactions] = useState([]);
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      setError(null);
      try {
        const [
          summaryRes,
          incomeAnalyticsRes,
          expenseAnalyticsRes,
          budgetRes,
          transactionsRes,
        ] = await Promise.all([
          api.get('/dashboard'),
          api.get('/analytics/income'),
          api.get('/analytics/expense'),
          api.get('/budget/status'),
          api.get('/transactions?limit=20'),
        ]);

        const summary = summaryRes.data;
        const income = incomeAnalyticsRes.data;
        const expense = expenseAnalyticsRes.data;

        setSummary({
          totalIncome: income.monthlyIncome || 0,
          totalExpense: expense.monthlyExpense || 0,
          balance: (income.monthlyIncome || 0) - (expense.monthlyExpense || 0),
          savingsRate: income.monthlyIncome > 0 ? Math.round(((income.monthlyIncome - expense.monthlyExpense) / income.monthlyIncome) * 100) : 0,
          incomeGrowth: income.growthPercentage || 0,
          expenseChange: 0,
          balanceChange: 0,
        });

        setIncomeAnalytics({
          monthlyIncome: income.monthlyIncome || 0,
          growthPercentage: income.growthPercentage || 0,
          highestSource: income.incomeSources?.[0]?.source || 'N/A',
          sources: income.incomeSources?.map(s => ({
            source: s.source,
            amount: s.amount,
            percentage: s.percentage,
          })) || [],
        });

        const monthlyExpense = (expense.categoryDistribution || []).reduce((sum, c) => sum + c.amount, 0);
        setExpenseAnalytics({
          monthlyExpense,
          highestCategory: expense.highestCategory || 'N/A',
          spendingRate: income.monthlyIncome > 0 ? Math.round((monthlyExpense / income.monthlyIncome) * 100) : 0,
          categories: expense.categoryDistribution?.map(c => ({
            category: c.category,
            amount: c.amount,
            percentage: c.percentage,
          })) || [],
        });

        setBudgetStatus({
          budgets: budgetRes.data?.budgets || [],
          summary: budgetRes.data?.summary || { totalBudget: 0, totalSpent: 0, totalRemaining: 0, overallPercentage: 0 },
        });

        const txData = transactionsRes.data?.results || [];
        setTransactions(txData);

        const months = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          months.push({ name: d.toLocaleString('default', { month: 'short' }), income: 0, expense: 0, savings: 0 });
        }
        txData.forEach(tx => {
          const d = new Date(tx.date);
          const monthName = d.toLocaleString('default', { month: 'short' });
          const entry = months.find(m => m.name === monthName);
          if (entry) {
            if (tx.type === 'income') entry.income += tx.amount;
            else entry.expense += tx.amount;
            entry.savings = entry.income - entry.expense;
          }
        });
        setTrends(months);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  const filteredTransactions = transactions
    .filter((tx) => (activeTab === 'income' ? tx.type === 'income' : tx.type === 'expense'))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '16px' }}>
        <div className="avatar" style={{ width: '60px', height: '60px', fontSize: '2rem', animation: 'pulse 1.5s infinite ease-in-out' }}><IconBarChart size={40} /></div>
        <h3>Loading your financial dashboard...</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Compiling live ledger records</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '16px' }}>
        <div className="avatar" style={{ width: '60px', height: '60px', fontSize: '2rem' }}><IconBarChart size={40} /></div>
        <h3>Unable to load dashboard</h3>
        <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Expense Meter</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, <strong>{user?.name || 'User'}</strong>. Here is your overview.</p>
        </div>
      </div>

      <section className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', lgDirection: 'row', gap: '30px', justifyContent: 'space-between', zIndex: 2, position: 'relative' }}>
          <div style={{ flex: 1.2 }}>
            <h1>Manage Your Money. Track Your Growth.</h1>
            <p>
              Naivaidya helps users track income, monitor expenses, analyze spending habits, and build better
              financial management practices through simple and visual financial insights.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary-hero" onClick={() => navigate('/income')}>
                <IconIncome size={18} /> Add Income
              </button>
              <button className="btn" onClick={() => navigate('/expense')}>
                <IconExpense size={18} /> Add Expense
              </button>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '280px' }}>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius)', border: '1px solid rgba(255,255,255,0.15)', padding: '20px', gap: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: '8px' }}><IconIncome color="#10b981" /></div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>Income</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#6ee7b7' }}>100%</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.3)', fontWeight: 'bold', fontSize: '1.2rem' }}><IconArrowRight size={16} color="#008081" /></div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: '8px' }}><IconExpense color="#10b981" /></div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>Expense</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fca5a5' }}>{expenseAnalytics.spendingRate}%</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.3)', fontWeight: 'bold', fontSize: '1.2rem' }}><IconArrowRight size={16} color="#008081" /></div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: '8px' }}><IconTarget color="#10b981" size={18} /></div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>Savings</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#93c5fd' }}>{summary.savingsRate}%</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.3)', fontWeight: 'bold', fontSize: '1.2rem' }}><IconArrowRight size={16} color="#008081" /></div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: '8px' }}><IconChartUp color="#10b981" size={18} /></div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>Growth</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fbbf24' }}>+{summary.balanceChange}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid-4" style={{ marginBottom: '28px' }}>
        <div className="card summary-card" style={{ borderTop: '5px solid var(--blue)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header" style={{ padding: 0, marginBottom: 0 }}>
              <span className="sc-label">TOTAL BALANCE</span>
              <div className="sc-icon icon-blue"><IconWallet size={20} /></div>
            </div>
            <h2 className="sc-value" style={{ marginTop: '8px' }}>{formatCurrency(summary.balance)}</h2>
          </div>
          <div className="sc-change positive" style={{ marginTop: '12px' }}>
            <span>▲</span>
            <span>+{summary.balanceChange}% growth this month</span>
          </div>
        </div>

        <div className="card summary-card" style={{ borderTop: '5px solid var(--green)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header" style={{ padding: 0, marginBottom: 0 }}>
              <span className="sc-label">TOTAL INCOME</span>
              <div className="sc-icon icon-green"><IconChartUp size={20} /></div>
            </div>
            <h2 className="sc-value" style={{ marginTop: '8px' }}>{formatCurrency(summary.totalIncome)}</h2>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div className="sc-change positive" style={{ marginBottom: '4px' }}>
              <span>▲</span>
              <span>+{summary.incomeGrowth}% vs prev month</span>
            </div>
            <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Top Source: <strong>{incomeAnalytics.highestSource}</strong></small>
          </div>
        </div>

        <div className="card summary-card" style={{ borderTop: '5px solid var(--red)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header" style={{ padding: 0, marginBottom: 0 }}>
              <span className="sc-label">TOTAL EXPENDITURE</span>
              <div className="sc-icon icon-red"><IconChartDown size={20} /></div>
            </div>
            <h2 className="sc-value" style={{ marginTop: '8px' }}>{formatCurrency(summary.totalExpense)}</h2>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div className="sc-change negative" style={{ marginBottom: '4px', color: 'var(--orange)' }}>
              <span>▼</span>
              <span>Spent {expenseAnalytics.spendingRate}% of Income</span>
            </div>
            <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Highest: <strong>{expenseAnalytics.highestCategory}</strong></small>
          </div>
        </div>

        <div className="card summary-card" style={{ borderTop: '5px solid var(--orange)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header" style={{ padding: 0, marginBottom: 0 }}>
              <span className="sc-label">TOTAL SAVINGS</span>
              <div className="sc-icon icon-orange"><IconPiggy size={20} /></div>
            </div>
            <h2 className="sc-value" style={{ marginTop: '8px' }}>{formatCurrency(summary.totalIncome - summary.totalExpense)}</h2>
          </div>
          <div style={{ marginTop: '12px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
              <span style={{ fontWeight: 600, color: 'var(--green)' }}>Savings Rate: {summary.savingsRate}%</span>
              <span style={{ color: 'var(--text-secondary)' }}>Goal: 30%</span>
            </div>
            <div className="budget-progress" style={{ margin: 0 }}>
              <div className="bp-bar" style={{ height: '6px' }}>
                <div 
                  className="bp-fill safe" 
                  style={{ 
                    width: `${Math.min(100, (summary.savingsRate / 30) * 100)}%`,
                    backgroundColor: summary.savingsRate >= 30 ? 'var(--green)' : 'var(--blue)' 
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="toggle-section card" style={{ padding: '24px' }}>
        <div className="toggle-header">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Financial Overview</h3>
          
          <div className="toggle-switch" style={{ width: '280px' }}>
            <div className={`toggle-slider ${activeTab}`} />
            <button
              className={`toggle-btn income ${activeTab === 'income' ? 'active' : ''}`}
              onClick={() => setActiveTab('income')}
              style={{ flex: 1, border: 'none', background: 'none' }}
            >
              Income Streams
            </button>
            <button
              className={`toggle-btn expense ${activeTab === 'expense' ? 'active' : ''}`}
              onClick={() => setActiveTab('expense')}
              style={{ flex: 1, border: 'none', background: 'none' }}
            >
              Expenditures
            </button>
          </div>
        </div>

        <div className="grid-2" style={{ marginTop: '24px' }}>
          
          <div className="card" style={{ boxShadow: 'none', border: '1px solid var(--border)', background: 'var(--bg)', padding: '20px' }}>
            <h4 style={{ marginBottom: '16px', fontWeight: 600, color: 'var(--text)' }}>
              {activeTab === 'income' ? 'Income Stream Contribution' : 'Expense Category Distribution'}
            </h4>
            
            <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {(activeTab === 'income' ? incomeAnalytics.sources : expenseAnalytics.categories).length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No data available yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activeTab === 'income' ? incomeAnalytics.sources : expenseAnalytics.categories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="amount"
                      nameKey={activeTab === 'income' ? 'source' : 'category'}
                    >
                      {(activeTab === 'income' ? incomeAnalytics.sources : expenseAnalytics.categories).map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={activeTab === 'income' ? COLORS.income[index % COLORS.income.length] : COLORS.expense[index % COLORS.expense.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), activeTab === 'income' ? 'Source' : 'Category']}
                      contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '16px' }}>
              {(activeTab === 'income' ? incomeAnalytics.sources : expenseAnalytics.categories).slice(0, 6).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: activeTab === 'income' ? COLORS.income[idx % COLORS.income.length] : COLORS.expense[idx % COLORS.expense.length] }} />
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', flex: 1, color: 'var(--text-secondary)' }}>
                    {activeTab === 'income' ? item.source : item.category}: <strong>{item.percentage}%</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ boxShadow: 'none', border: '1px solid var(--border)', background: 'var(--bg)', padding: '20px' }}>
            {activeTab === 'income' ? (
              <>
                <h4 style={{ marginBottom: '16px', fontWeight: 600, color: 'var(--text)' }}>Monthly Income Growth Trend</h4>
                <div style={{ height: '240px' }}>
                  {trends.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', paddingTop: '80px' }}>No trend data yet.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--green)" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="var(--green)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
                        <YAxis stroke="var(--text-muted)" fontSize={11} />
                        <Tooltip formatter={(value) => [formatCurrency(value), 'Income']} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
                        <Area type="monotone" dataKey="income" stroke="var(--green)" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Showing income trajectory over the last 6 months
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ fontWeight: 600, color: 'var(--text)', margin: 0 }}>Monthly Budget Usage</h4>
                  <small style={{ color: 'var(--text-secondary)' }}>Overall: <strong>{budgetStatus.summary.overallPercentage}% used</strong></small>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '240px', overflowY: 'auto', paddingRight: '4px' }}>
                  {budgetStatus.budgets.length === 0 ? (
                    <div className="empty-state" style={{ padding: '20px' }}>
                      <div className="empty-icon"><IconTarget size={40} /></div>
                      <p>No monthly category budgets set yet.</p>
                      <button className="btn btn-sm btn-outline" style={{ marginTop: '10px' }} onClick={() => navigate('/budget')}>Setup Budgets</button>
                    </div>
                  ) : (
                    budgetStatus.budgets.map((b, index) => {
                      let fillClass = 'safe';
                      if (b.percentage >= 100) fillClass = 'danger';
                      else if (b.percentage >= 80) fillClass = 'warning';

                      return (
                        <div key={index} className="budget-progress" style={{ margin: 0 }}>
                          <div className="bp-header" style={{ fontSize: '0.82rem' }}>
                            <span style={{ fontWeight: 600 }}>{getCategoryIcon(b.category)} {b.category}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>
                              {formatCurrency(b.spent)} / <strong>{formatCurrency(b.limit)}</strong>
                            </span>
                          </div>
                          <div className="bp-bar" style={{ height: '8px', marginTop: '4px' }}>
                            <div className={`bp-fill ${fillClass}`} style={{ width: `${Math.min(100, b.percentage)}%` }} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginTop: '2px', color: 'var(--text-muted)' }}>
                            <span>{b.percentage}% used</span>
                            <span style={{ 
                              color: b.status === 'Exceeded' ? 'var(--red)' : b.status === 'Warning' ? 'var(--orange)' : 'var(--green)',
                              fontWeight: 600
                            }}>
                              {b.status === 'Exceeded' ? 'Limit Exceeded!' : b.status === 'Warning' ? 'Approaching Limit' : 'On Track'}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent {activeTab === 'income' ? 'Income Stream' : 'Expenditure'} Transactions</h3>
          <button className="btn btn-sm btn-outline" onClick={() => navigate('/transactions')}>
            View All Ledger
          </button>
        </div>

        <div>
          {filteredTransactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><IconFallback size={40} /></div>
              <p>No recent {activeTab === 'income' ? 'income' : 'expense'} transactions found.</p>
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div key={tx.id || tx._id} className="transaction-card">
                <div className="tx-icon" style={{ 
                  backgroundColor: tx.type === 'income' ? 'var(--green-light)' : 'var(--red-light)', 
                  color: tx.type === 'income' ? 'var(--green)' : 'var(--red)'
                }}>
                  {getCategoryIcon(tx.category)}
                </div>
                
                <div className="tx-info">
                  <div className="tx-title">{tx.category}</div>
                  <div className="tx-meta">
                    <span>{new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                    <span>•</span>
                    <span>{getPaymentMethodIcon(tx.paymentMethod)} {tx.paymentMethod}</span>
                    {tx.merchantOrSource && (
                      <>
                        <span>•</span>
                        <span>{tx.merchantOrSource}</span>
                      </>
                    )}
                    {tx.description && (
                      <>
                        <span>•</span>
                        <span style={{ fontStyle: 'italic' }}>{tx.description}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className={`tx-amount ${tx.type === 'income' ? 'income' : 'expense'}`} style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
