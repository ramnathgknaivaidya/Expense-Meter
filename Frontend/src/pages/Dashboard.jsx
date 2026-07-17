import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import './dashboard.css';

const formatCurrency = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);
const getCatIcon = (c) => { const m = c.toLowerCase(); if(m.includes('salary'))return'💼';if(m.includes('freelance'))return'💻';if(m.includes('business'))return'🏪';if(m.includes('invest'))return'📈';if(m.includes('bonus'))return'�';if(m.includes('food'))return'🍔';if(m.includes('transport'))return'�';if(m.includes('housing'))return'🏠';if(m.includes('bill'))return'💡';if(m.includes('shopping'))return'🛍️';if(m.includes('health'))return'🏥';if(m.includes('education'))return'🎓';if(m.includes('entertainment'))return'�';return'💸'; };
const getPayIcon = (m) => { const p=m?.toLowerCase()||'';if(p.includes('cash'))return'💵';if(p.includes('upi'))return'📱';if(p.includes('card'))return'💳';if(p.includes('bank'))return'🏛️';return'�'; };

const MOCK = {
  summary: { totalIncome: 75000, totalExpense: 39500, balance: 35500, savingsRate: 47, incomeGrowth: 15.4, balanceChange: 24.6 },
  incomeAnalytics: { sources: [
    { source: 'Salary', amount: 50000, percentage: 67 },
    { source: 'Freelance', amount: 12000, percentage: 16 },
    { source: 'Business', amount: 8000, percentage: 11 },
    { source: 'Investment', amount: 3000, percentage: 4 },
    { source: 'Bonus', amount: 2000, percentage: 2 },
  ]},
  expenseAnalytics: { highestCategory: 'Housing', spendingRate: 53, categories: [
    { category: 'Housing', amount: 15000, percentage: 38 },
    { category: 'Food', amount: 5500, percentage: 14 },
    { category: 'Transport', amount: 5500, percentage: 14 },
    { category: 'Education', amount: 5000, percentage: 13 },
    { category: 'Bills', amount: 3000, percentage: 8 },
    { category: 'Shopping', amount: 2500, percentage: 6 },
  ]},
  budgetStatus: { budgets: [
    { category: 'Housing', limit: 15000, spent: 15000, percentage: 100, status: 'Exceeded' },
    { category: 'Food', limit: 6000, spent: 5500, percentage: 92, status: 'Warning' },
    { category: 'Transport', limit: 3000, spent: 5500, percentage: 183, status: 'Exceeded' },
    { category: 'Shopping', limit: 5000, spent: 2500, percentage: 50, status: 'On Track' },
  ], summary: { totalBudget: 29000, totalSpent: 28500, overallPercentage: 98 }},
  transactions: [
    { id:'t1',type:'income',amount:50000,category:'Salary',paymentMethod:'Bank Transfer',description:'July salary',date:'2026-07-01T00:00:00.000Z'},
    { id:'t2',type:'expense',amount:15000,category:'Housing',paymentMethod:'Bank Transfer',description:'Monthly rent',date:'2026-07-01T00:00:00.000Z',merchantOrSource:'Landlord'},
    { id:'t3',type:'income',amount:12000,category:'Freelance',paymentMethod:'UPI',description:'Web project',date:'2026-07-05T00:00:00.000Z'},
    { id:'t4',type:'expense',amount:5000,category:'Education',paymentMethod:'UPI',description:'Online course',date:'2026-07-14T00:00:00.000Z',merchantOrSource:'Coursera'},
    { id:'t5',type:'expense',amount:5500,category:'Food',paymentMethod:'UPI',description:'Food delivery',date:'2026-07-02T00:00:00.000Z',merchantOrSource:'Swiggy'},
    { id:'t6',type:'income',amount:8000,category:'Business',paymentMethod:'Card',description:'Side business',date:'2026-07-15T00:00:00.000Z'},
    { id:'t7',type:'expense',amount:3500,category:'Transport',paymentMethod:'UPI',description:'Fuel',date:'2026-07-20T00:00:00.000Z',merchantOrSource:'Indian Oil'},
    { id:'t8',type:'expense',amount:2500,category:'Shopping',paymentMethod:'Credit Card',description:'Headphones',date:'2026-07-08T00:00:00.000Z',merchantOrSource:'Amazon'},
  ],
  trends: [
    { name:'Feb',income:55000,expense:32000 },{ name:'Mar',income:60000,expense:34000 },
    { name:'Apr',income:62000,expense:39000 },{ name:'May',income:68000,expense:36000 },
    { name:'Jun',income:70000,expense:37500 },{ name:'Jul',income:75000,expense:39500 },
  ],
};
const COLORS_IN = ['#10b981','#34d399','#059669','#6ee7b7','#a7f3d0'];
const COLORS_EX = ['#f97316','#ef4444','#f87171','#fb923c','#fca5a5','#fdba74'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState('income');
  const [loading, setLoading] = useState(true);
  const [mock, setMock] = useState(false);
  const [data, setData] = useState(MOCK);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [s,ia,ea,bs,tx] = await Promise.all([
          api.get('/dashboard'),api.get('/analytics/income'),api.get('/analytics/expense'),
          api.get('/budget/status'),api.get('/transactions?limit=20'),
        ]);
        setData({
          summary:{totalIncome:s.data.totalIncome||0,totalExpense:s.data.totalExpense||0,balance:s.data.balance||0,savingsRate:s.data.savings||0,incomeGrowth:ia.data.growthPercentage||0,balanceChange:24.6},
          incomeAnalytics:{sources:ia.data.incomeSources?.map(x=>({source:x.source,amount:x.amount,percentage:x.percentage}))||[]},
          expenseAnalytics:{highestCategory:ea.data.highestCategory||'N/A',spendingRate:s.data.totalIncome>0?Math.round((s.data.totalExpense/s.data.totalIncome)*100):0,categories:ea.data.categoryDistribution?.map(c=>({category:c.category,amount:c.amount,percentage:c.percentage}))||[]},
          budgetStatus:{budgets:bs.data.budgets||[],summary:bs.data.summary||{totalBudget:0,totalSpent:0,overallPercentage:0}},
          transactions:tx.data.results||tx.data||[],
          trends:MOCK.trends,
        });
        setMock(false);
      } catch { setData(MOCK); setMock(true); }
      finally { setLoading(false); }
    })();
  }, [user]);

  const { summary, incomeAnalytics, expenseAnalytics, budgetStatus, transactions, trends } = data;
  const filteredTx = transactions.filter(t => tab === 'income' ? t.type === 'income' : t.type === 'expense').slice(0, 6);

  if (loading) return (
    <div className="page-body dash-loading">
      <div className="dash-loader"><div></div><div></div><div></div></div>
      <h3>Preparing your dashboard...</h3>
      <p>Crunching the numbers</p>
    </div>
  );

  return (
    <div className="page-body dash">
      {/* === HERO === */}
      <section className="dash-hero">
        <div className="dash-hero-text">
          <span className="dash-greeting">Welcome back, {user?.name || 'User'} 👋</span>
          <h1>Manage Your Money. Track Your Growth.</h1>
          <p>Track income, monitor expenses, analyze spending habits, and build better financial practices.</p>
          {mock && <span className="dash-mock-badge">⚡ Demo Data</span>}
        </div>
        <div className="dash-hero-right">
          <div className="dash-flow">
            <div className="dash-flow-node"><span className="dash-flow-icon">💰</span><span className="dash-flow-label">Income</span><span className="dash-flow-val green">100%</span></div>
            <span className="dash-flow-arrow">→</span>
            <div className="dash-flow-node"><span className="dash-flow-icon">💸</span><span className="dash-flow-label">Expense</span><span className="dash-flow-val red">{expenseAnalytics.spendingRate}%</span></div>
            <span className="dash-flow-arrow">→</span>
            <div className="dash-flow-node"><span className="dash-flow-icon">🐷</span><span className="dash-flow-label">Savings</span><span className="dash-flow-val blue">{summary.savingsRate}%</span></div>
            <span className="dash-flow-arrow">→</span>
            <div className="dash-flow-node"><span className="dash-flow-icon">🚀</span><span className="dash-flow-label">Growth</span><span className="dash-flow-val gold">+{summary.balanceChange}%</span></div>
          </div>
          <div className="dash-hero-actions">
            <button className="dash-action-primary" onClick={() => navigate('/income')}>💰 Add Income</button>
            <button className="dash-action-secondary" onClick={() => navigate('/expense')}>💳 Add Expense</button>
          </div>
        </div>
      </section>

      {/* === METRIC CARDS === */}
      <section className="dash-metrics">
        <div className="dash-metric dash-m-balance">
          <div className="dash-m-top"><span className="dash-m-emoji">💰</span><span className="dash-m-change positive">+{summary.balanceChange}%</span></div>
          <div className="dash-m-value">{formatCurrency(summary.balance)}</div>
          <div className="dash-m-label">Net Balance</div>
        </div>
        <div className="dash-metric dash-m-income">
          <div className="dash-m-top"><span className="dash-m-emoji">📈</span><span className="dash-m-change positive">+{summary.incomeGrowth}%</span></div>
          <div className="dash-m-value">{formatCurrency(summary.totalIncome)}</div>
          <div className="dash-m-label">Total Income</div>
        </div>
        <div className="dash-metric dash-m-expense">
          <div className="dash-m-top"><span className="dash-m-emoji">💸</span><span className="dash-m-change negative">{expenseAnalytics.spendingRate}%</span></div>
          <div className="dash-m-value">{formatCurrency(summary.totalExpense)}</div>
          <div className="dash-m-label">Total Expenses</div>
        </div>
        <div className="dash-metric dash-m-savings">
          <div className="dash-m-top"><span className="dash-m-emoji">🏦</span></div>
          <div className="dash-m-value">{summary.savingsRate}%</div>
          <div className="dash-m-label">Savings Rate</div>
          <div className="dash-m-bar"><div className="dash-m-bar-fill" style={{width:`${summary.savingsRate}%`}}></div></div>
        </div>
      </section>

      {/* === CHART + PIE === */}
      <section className="dash-charts">
        <div className="dash-chart-main">
          <div className="dash-chart-head">
            <h3>Income vs Expenses</h3>
            <span className="dash-chart-period">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trends} margin={{top:10,right:10,left:-20,bottom:0}}>
              <defs>
                <linearGradient id="dGIn" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="100%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                <linearGradient id="dGEx" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444" stopOpacity={0.2}/><stop offset="100%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#ccc" fontSize={11} tickLine={false} axisLine={false}/>
              <YAxis stroke="#ccc" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v=>`₹${v/1000}k`}/>
              <Tooltip formatter={v=>formatCurrency(v)} contentStyle={{borderRadius:'12px',border:'none',boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}/>
              <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2.5} fill="url(#dGIn)" dot={{r:3,fill:'#10b981',stroke:'#fff',strokeWidth:2}}/>
              <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fill="url(#dGEx)" dot={{r:3,fill:'#ef4444',stroke:'#fff',strokeWidth:2}}/>
            </AreaChart>
          </ResponsiveContainer>
          <div className="dash-chart-legend">
            <span className="dash-legend-item"><span className="dash-dot" style={{background:'#10b981'}}></span>Income</span>
            <span className="dash-legend-item"><span className="dash-dot" style={{background:'#ef4444'}}></span>Expenses</span>
          </div>
        </div>

        <div className="dash-chart-pie">
          <div className="dash-chart-head">
            <h3>{tab === 'income' ? 'Income Sources' : 'Expense Breakdown'}</h3>
            <div className="dash-tab-switch">
              <button className={tab==='income'?'active':''} onClick={()=>setTab('income')}>Income</button>
              <button className={tab==='expense'?'active':''} onClick={()=>setTab('expense')}>Expense</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={tab==='income'?incomeAnalytics.sources:expenseAnalytics.categories} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="amount" nameKey={tab==='income'?'source':'category'}>
                {(tab==='income'?incomeAnalytics.sources:expenseAnalytics.categories).map((_,i)=><Cell key={i} fill={tab==='income'?COLORS_IN[i%COLORS_IN.length]:COLORS_EX[i%COLORS_EX.length]}/>)}
              </Pie>
              <Tooltip formatter={v=>formatCurrency(v)} contentStyle={{borderRadius:'12px',border:'none',boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="dash-pie-legend">
            {(tab==='income'?incomeAnalytics.sources:expenseAnalytics.categories).slice(0,5).map((item,i)=>(
              <div key={i} className="dash-pie-item">
                <span className="dash-dot" style={{background:tab==='income'?COLORS_IN[i%COLORS_IN.length]:COLORS_EX[i%COLORS_EX.length]}}></span>
                <span className="dash-pie-name">{tab==='income'?item.source:item.category}</span>
                <span className="dash-pie-pct">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === BUDGET + TRANSACTIONS === */}
      <section className="dash-bottom">
        {/* Budget Progress */}
        <div className="dash-budget-card">
          <div className="dash-card-head">
            <h3>Budget Status</h3>
            <span className="dash-budget-overall">{budgetStatus.summary.overallPercentage}% used</span>
          </div>
          <div className="dash-budgets">
            {budgetStatus.budgets.map((b,i) => {
              const cls = b.percentage >= 100 ? 'danger' : b.percentage >= 80 ? 'warning' : 'safe';
              return (
                <div key={i} className="dash-budget-row">
                  <div className="dash-budget-info">
                    <span className="dash-budget-cat">{getCatIcon(b.category)} {b.category}</span>
                    <span className="dash-budget-nums">{formatCurrency(b.spent)} / {formatCurrency(b.limit)}</span>
                  </div>
                  <div className="dash-budget-bar"><div className={`dash-budget-fill ${cls}`} style={{width:`${Math.min(b.percentage,100)}%`}}></div></div>
                  <span className={`dash-budget-status ${cls}`}>{b.status}</span>
                </div>
              );
            })}
          </div>
          <button className="dash-budget-link" onClick={() => navigate('/budget')}>Manage Budgets →</button>
        </div>

        {/* Recent Transactions */}
        <div className="dash-tx-card">
          <div className="dash-card-head">
            <h3>Recent Activity</h3>
            <button className="dash-tx-viewall" onClick={() => navigate('/transactions')}>View All →</button>
          </div>
          <div className="dash-tx-list">
            {filteredTx.length === 0 ? (
              <div className="dash-tx-empty">No {tab} transactions yet.</div>
            ) : filteredTx.map(tx => (
              <div key={tx.id} className={`dash-tx-row ${tx.type}`}>
                <div className={`dash-tx-icon ${tx.type}`}>{getCatIcon(tx.category)}</div>
                <div className="dash-tx-info">
                  <span className="dash-tx-name">{tx.description || tx.category}</span>
                  <span className="dash-tx-meta">{new Date(tx.date).toLocaleDateString('en-IN',{day:'2-digit',month:'short'})} • {getPayIcon(tx.paymentMethod)} {tx.paymentMethod}</span>
                </div>
                <span className={`dash-tx-amt ${tx.type}`}>{tx.type==='income'?'+':'-'}{formatCurrency(tx.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === QUICK NAV === */}
      <section className="dash-quick-nav">
        <button onClick={() => navigate('/income')}><span>💰</span>Income</button>
        <button onClick={() => navigate('/expense')}><span>💳</span>Expenses</button>
        <button onClick={() => navigate('/analytics')}><span>📊</span>Analytics</button>
        <button onClick={() => navigate('/budget')}><span>🎯</span>Budget</button>
        <button onClick={() => navigate('/transactions')}><span>🔄</span>History</button>
        <button onClick={() => navigate('/profile')}><span>⚙️</span>Settings</button>
      </section>
    </div>
  );
}
