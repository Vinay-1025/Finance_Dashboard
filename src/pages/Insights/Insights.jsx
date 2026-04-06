import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../features/transactions/transactionsThunks";
import TopInsights from "../../components/dashboard/Insights";
import MonthlyComparisonChart from "../../components/charts/MonthlyComparisonChart";
import SmartObservations from "../../components/insights/SmartObservations";
import { CircularProgress } from "@mui/material";

const InsightsPage = () => {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const categorySummary = useMemo(() => {
    const summary = {};
    data.forEach(t => {
      if (!summary[t.category]) summary[t.category] = { income: 0, expense: 0, total: 0 };
      if (t.type === "income") summary[t.category].income += t.amount;
      else summary[t.category].expense += t.amount;
      summary[t.category].total = summary[t.category].income - summary[t.category].expense;
    });
    return summary;
  }, [data]);

  return (
    <div style={{ padding: '0 24px', paddingBottom: '40px' }}>
      <h2 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>Advanced Insights Engine</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Algorithmically mapping complex mathematical observations from your historical data.</p>
      
      {status === "loading" && <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}><CircularProgress style={{ color: 'var(--primary)' }}/></div>}
      
      {status === "succeeded" && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {data.length > 0 ? (
            <>
              <TopInsights transactions={data} />
              
              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ margin: '0 0 20px 0', color: 'var(--primary)', fontSize: '1.1rem', fontWeight: 700 }}>Category Breakdown</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                   {Object.entries(categorySummary).map(([cat, vals]) => (
                      <div key={cat} style={{ backgroundColor: 'var(--bg-color)', padding: '16px', borderRadius: '12px', border: '1px solid var(--card-border)', transition: 'transform 0.2s ease' }} className="category-item-hover">
                         <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>{cat}</div>
                         <div style={{ fontSize: '1.2rem', fontWeight: 800, color: vals.total >= 0 ? 'var(--primary)' : '#f43f5e' }}>
                            ₹{vals.total.toLocaleString()}
                         </div>
                         <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                           Net Profit/Loss
                         </div>
                      </div>
                   ))}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
                 <MonthlyComparisonChart transactions={data} />
                 <SmartObservations transactions={data} />
              </div>
            </>
          ) : (
            <div className="card" style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--card-color)', borderRadius: '16px', border: '1px dashed var(--card-border)' }}>
              <p style={{ color: 'var(--text-muted)' }}>Start adding historical data to generate algorithmically derived insights.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InsightsPage;
