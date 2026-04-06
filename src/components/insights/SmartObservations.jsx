import React, { useMemo } from "react";
import { FaLightbulb } from "react-icons/fa";

const SmartObservations = ({ transactions }) => {
  const observations = useMemo(() => {
    if (!transactions || transactions.length === 0) return ["Not enough data mapped to calculate advanced properties across the dashboard engine yet."];

    let totalIncome = 0;
    let totalExpense = 0;
    let categoryExpenses = {};
    let months = {};

    transactions.forEach(t => {
       if (t.type === "income") totalIncome += t.amount;
       if (t.type === "expense") {
         totalExpense += t.amount;
         categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
       }

       const yyyymm = t.date.substring(0, 7);
       if (!months[yyyymm]) months[yyyymm] = { income: 0, expense: 0 };
       
       if (t.type === "income") months[yyyymm].income += t.amount;
       if (t.type === "expense") months[yyyymm].expense += t.amount;
    });

    const obs = [];

    const highestCat = Object.keys(categoryExpenses).sort((a,b) => categoryExpenses[b] - categoryExpenses[a])[0];
    if (highestCat && totalExpense) {
      const pct = ((categoryExpenses[highestCat] / totalExpense) * 100).toFixed(0);
      obs.push(`You allocate roughly ${pct}% of your entire system-wide outflows strictly toward the ${highestCat} category.`);
    }

    let savedMonths = 0;
    let deficitMonths = 0;
    Object.keys(months).forEach(m => {
       if (months[m].income > months[m].expense) savedMonths++;
       else if (months[m].expense > months[m].income) deficitMonths++;
    });

    if (savedMonths > 0) {
      obs.push(`You successfully outpaced expenses and generated surplus income retention across ${savedMonths} unique chronological periods.`);
    }
    if (deficitMonths > savedMonths && deficitMonths > 0) {
      obs.push(`Warning: Your active mathematical spending has run into a gross deficit scale across ${deficitMonths} unique months.`);
    }

    if (totalExpense > totalIncome * 0.9 && totalIncome > 0) {
      obs.push(`Your overall expense-to-income ratio is currently dangerously high. Consider evaluating recurring structural transactions.`);
    } else if (totalIncome > totalExpense) {
      obs.push(`Excellent global structural health! Your lifetime incoming liquidity safely exceeds all cumulative network expenses.`);
    }

    return obs;
  }, [transactions]);

  return (
    <div className="card insights-card" style={{ padding: '24px', backgroundColor: 'var(--card-color)' }}>
      <h4 style={{ margin: "0 0 20px 0", color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FaLightbulb color="#f59e0b" /> 
        Algorithmic Observations
      </h4>
      <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {observations.map((o, i) => (
          <li key={i} style={{ lineHeight: '1.6' }}>{o}</li>
        ))}
      </ul>
    </div>
  );
};

export default SmartObservations;
