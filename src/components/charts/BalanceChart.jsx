import React, { useState, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import useTheme from "../../hooks/useTheme";
import "./BalanceChart.css";

const BalanceChart = ({ transactions, selectedMonth }) => {
  const [view, setView] = useState("balance");
  const { theme } = useTheme();

  const chartData = useMemo(() => {
    let balance = 0;
    const sorted = [...(transactions || [])].sort((a,b) => new Date(a.date) - new Date(b.date));
    
    const grouped = {};
    const dates = [];
    const balances = [];
    const incomes = [];
    const expenses = [];

    sorted.forEach((t) => {
      if (!grouped[t.date]) {
         grouped[t.date] = { date: t.date, income: 0, expense: 0, balance: 0 };
         dates.push(t.date);
      }
      
      if (t.type === "income") {
        balance += t.amount;
        grouped[t.date].income += t.amount;
      } else {
        balance -= t.amount;
        grouped[t.date].expense += t.amount;
      }
      grouped[t.date].balance = balance;
    });

    dates.forEach(d => {
       balances.push(grouped[d].balance);
       incomes.push(grouped[d].income);
       expenses.push(grouped[d].expense);
    });

    return { dates, balances, incomes, expenses };
  }, [transactions]);

  const series = view === "balance" 
    ? [{ name: "Balance", data: chartData.balances }]
    : [
        { name: "Income", data: chartData.incomes },
        { name: "Expense", data: chartData.expenses }
      ];

  const colors = view === "balance" ? ["#7b46bc"] : ["#22c55e", "#ef4444"];

  const formatHeading = () => {
    let title = view === "balance" ? "Balance Trend" : "Income vs Expense";
    if (selectedMonth && selectedMonth !== "All") {
      const [y, m] = selectedMonth.split("-");
      const date = new Date(parseInt(y), parseInt(m) - 1);
      const monthYear = date.toLocaleString("default", { month: "long", year: "numeric" });
      title = `${monthYear} ${title}`;
    }
    return title;
  };

  const options = {
    chart: {
      id: "mainChart",
      type: 'area',
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'Inter, sans-serif'
    },
    theme: {
      mode: theme
    },
    colors: colors,
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    markers: {
      size: 4,
      colors: ['var(--card-color)'],
      strokeColors: colors,
      strokeWidth: 2,
      hover: {
        size: 6
      }
    },
    xaxis: {
      categories: chartData.dates,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        formatter: function(val) {
          if (!val) return "";
          if (selectedMonth && selectedMonth !== "All") {
            return parseInt(val.split("-")[2], 10).toString();
          }
          const [y, m, d] = val.split("-");
          const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
          return date.toLocaleString("default", { month: "short", day: "numeric" });
        },
        style: { colors: 'var(--text-muted)' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: 'var(--text-muted)' }
      }
    },
    grid: {
      borderColor: 'var(--card-border)',
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
    },
    tooltip: { theme: theme },
    legend: { show: view === "income-expense" }
  };

  const brushOptions = {
    chart: {
      id: "brushChart",
      type: "line",
      brush: {
        target: "mainChart",
        enabled: true
      },
      selection: {
        enabled: true,
        xaxis: {
          min: chartData.dates.length > 8 ? chartData.dates[chartData.dates.length - 8] : chartData.dates[0],
          max: chartData.dates.length ? chartData.dates[chartData.dates.length - 1] : undefined
        }
      },
      background: 'transparent',
      toolbar: { show: false }
    },
    theme: { mode: theme },
    colors: colors,
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: {
      categories: chartData.dates,
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false }
    },
    yaxis: {
      show: false,
      tickAmount: 2
    },
    grid: { show: false },
    legend: { show: false }
  };

  const isAllTime = selectedMonth === "All";

  return (
    <div className="card chart-card">
      <div className="chart-header">
        <h4>{formatHeading()}</h4>
        <select value={view} onChange={(e) => setView(e.target.value)} className="chart-select">
          <option value="balance">Balance Trend</option>
          <option value="income-expense">Income vs Expense</option>
        </select>
      </div>
      <div className="chart-container" style={{ minHeight: "280px" }}>
        <ReactApexChart options={options} series={series} type="area" height={isAllTime ? 210 : 280} />
        {isAllTime && (
          <ReactApexChart options={brushOptions} series={series} type="line" height={70} />
        )}
      </div>
    </div>
  );
};

export default BalanceChart;