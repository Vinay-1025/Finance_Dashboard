import React, { useMemo } from "react";
import { FaFire, FaRegCalendarCheck, FaTrophy } from "react-icons/fa";
import "./Insights.css";

const Insights = ({ transactions }) => {
  const insights = useMemo(() => {
    if (!transactions || transactions.length === 0) return null;

    let totalExpense = 0;
    let categoryTotals = {};
    let biggestTx = { amount: 0, category: '' };
    const uniqueDays = new Set();
    
    transactions.forEach((t) => {
      uniqueDays.add(t.date);
      if (t.type === "expense") {
        totalExpense += t.amount;
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        if (t.amount > biggestTx.amount) biggestTx = t;
      }
    });

    const highestCategory = Object.keys(categoryTotals).length > 0 
      ? Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b)
      : "None";

    const avgDailySpend = uniqueDays.size > 0 ? (totalExpense / uniqueDays.size).toFixed(0) : 0;

    return { highestCategory, biggestTx, avgDailySpend };
  }, [transactions]);

  if (!insights) return null;

  return (
    <div className="card insights-card" style={{ marginTop: '24px', padding: '24px' }}>
      <h4 style={{ margin: "0 0 20px 0", color: "var(--text-main)" }}>Smart Insights</h4>
      <div className="insights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        <div className="insight-item" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px', backgroundColor: 'var(--background)' }}>
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '16px', borderRadius: '12px', fontSize: '1.5rem', display: 'flex' }}>
             <FaFire />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Top Expense Category</p>
            <h3 style={{ margin: 0, color: 'var(--text-main)' }}>{insights.highestCategory}</h3>
          </div>
        </div>

        <div className="insight-item" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px', backgroundColor: 'var(--background)' }}>
          <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '16px', borderRadius: '12px', fontSize: '1.5rem', display: 'flex' }}>
             <FaRegCalendarCheck />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Avg Daily Spend</p>
            <h3 style={{ margin: 0, color: 'var(--text-main)' }}>₹{Number(insights.avgDailySpend).toLocaleString()}</h3>
          </div>
        </div>

        <div className="insight-item" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px', backgroundColor: 'var(--background)' }}>
          <div style={{ backgroundColor: 'rgba(123, 70, 188, 0.1)', color: 'var(--primary)', padding: '16px', borderRadius: '12px', fontSize: '1.5rem', display: 'flex' }}>
             <FaTrophy />
          </div>
          <div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Largest Single Expense</p>
            <h3 style={{ margin: 0, color: 'var(--text-main)' }}>₹{insights.biggestTx.amount.toLocaleString()} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>({insights.biggestTx.category || 'N/A'})</span></h3>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Insights;