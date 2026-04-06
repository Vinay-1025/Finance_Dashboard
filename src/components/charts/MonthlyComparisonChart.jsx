import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import useTheme from "../../hooks/useTheme";

const MonthlyComparisonChart = ({ transactions }) => {
  const { theme } = useTheme();

  const chartData = useMemo(() => {
    if (!transactions) return { categories: [], income: [], expense: [] };

    const history = {};
    transactions.forEach(t => {
      const parts = t.date.split("-");
      if(parts.length < 2) return;
      const key = `${parts[0]}-${parts[1]}`;
      
      if(!history[key]) history[key] = { income: 0, expense: 0 };
      if(t.type === "income") history[key].income += t.amount;
      if(t.type === "expense") history[key].expense += t.amount;
    });

    const sortedKeys = Object.keys(history).sort();

    const categories = sortedKeys.map(k => {
      const [y, m] = k.split("-");
      const d = new Date(parseInt(y), parseInt(m) - 1);
      return d.toLocaleString("default", { month: "short", year: "2-digit" }); 
    });

    const income = sortedKeys.map(k => history[k].income);
    const expense = sortedKeys.map(k => history[k].expense);

    return { categories, income, expense };
  }, [transactions]);

  const series = [
    { name: "Income", data: chartData.income },
    { name: "Expense", data: chartData.expense }
  ];

  const options = {
    chart: { type: 'bar', background: 'transparent', toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
    theme: { mode: theme },
    colors: ['#22c55e', '#ef4444'],
    plotOptions: { bar: { columnWidth: '60%', borderRadius: 4 } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: {
      categories: chartData.categories,
      labels: { style: { colors: 'var(--text-muted)' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: 'var(--text-muted)' } }
    },
    grid: { borderColor: 'var(--card-border)', strokeDashArray: 4, yaxis: { lines: { show: true } }, xaxis: { lines: { show: false }} },
    legend: { show: true, labels: { colors: 'var(--text-main)' } },
    tooltip: { theme: theme }
  };

  return (
    <div className="card chart-card" style={{ padding: '24px' }}>
      <h4 style={{ margin: "0 0 20px 0", color: 'var(--text-main)' }}>Monthly Cashflow Differential</h4>
      <div style={{ minHeight: '300px' }}>
         <ReactApexChart options={options} series={series} type="bar" height={300} />
      </div>
    </div>
  );
};

export default MonthlyComparisonChart;
