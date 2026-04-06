import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../features/transactions/transactionsThunks";
import { getSummary } from "../../utils/calculations";

import SummaryCards from "../../components/dashboard/SummaryCards";
import BalanceChart from "../../components/charts/BalanceChart";
import CategoryChart from "../../components/charts/CategoryChart";
import Insights from "../../components/dashboard/Insights";

import "./Dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.transactions);
  const [selectedMonth, setSelectedMonth] = useState("");

  const availableMonths = useMemo(() => {
    if (!data.length) return [];
    const months = new Set();
    data.forEach(t => {
      const ym = t.date.substring(0, 7);
      months.add(ym);
    });
    return Array.from(months).sort().reverse();
  }, [data]);

  useEffect(() => {
    if (availableMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(availableMonths[0]);
    }
  }, [availableMonths, selectedMonth]);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const filteredData = useMemo(() => {
    if (selectedMonth === "All") return data;
    return data.filter(t => t.date.startsWith(selectedMonth));
  }, [data, selectedMonth]);

  if (status === "loading") return <p style={{ color: 'var(--text-main)', padding: '20px' }}>Loading workspace...</p>;
  if (!data.length && status === "succeeded") return <p style={{ color: 'var(--text-main)', padding: '20px' }}>No mock data active.</p>;

  const summary = getSummary(filteredData);

  const formatMonth = (ymString) => {
    const [y, m] = ymString.split("-");
    const date = new Date(parseInt(y), parseInt(m) - 1);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  if (data.length === 0) {
    return (
      <div className="dashboard-empty-state" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--card-color)', borderRadius: '16px', border: '1px dashed var(--card-border)', marginTop: '24px' }}>
         <h1 style={{ color: 'var(--primary)', marginBottom: '8px', fontSize: '1.2rem' }}>Welcome to Finance Pro</h1>
         <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>No transactions found. Start by adding a transaction to see your financial analytics.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <h2 style={{ margin: 0, color: "var(--text-main)", fontSize: "1.2rem", fontWeight: "700" }}>Analytics</h2>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="chart-select"
          style={{ padding: "8px 16px", fontSize: "0.7rem" }}
        >
          <option value="All">All Time</option>
          {availableMonths.map((ym) => (
            <option key={ym} value={ym}>{ym}</option>
          ))}
        </select>
      </div>

      <SummaryCards summary={summary} transactions={filteredData} />

      <div className="charts">
        <BalanceChart transactions={filteredData} selectedMonth={selectedMonth} />
        <CategoryChart transactions={filteredData} />
      </div>

      <Insights transactions={filteredData} />
    </div>
  );
};

export default Dashboard;