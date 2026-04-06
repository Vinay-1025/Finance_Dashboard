import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { HiTrendingUp, HiTrendingDown, HiCurrencyRupee } from "react-icons/hi";
import { useSelector } from "react-redux";
import useTheme from "../../hooks/useTheme";
import "./SummaryCards.css";

const Sparkline = ({ data, color, themeMode }) => {
  const last10 = data.slice(-10);
  const series = [{ name: 'Value', data: last10.map(d => d.y) }];
  const dates = last10.map(d => d.x);

  const options = {
    chart: {
      type: 'line',
      sparkline: { enabled: true },
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      }
    },
    stroke: { curve: 'smooth', width: 2, colors: [color] },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100],
        colorStops: [
          { offset: 0, color: color, opacity: 1 },
          { offset: 100, color: color, opacity: 1 }
        ]
      }
    },
    markers: { size: 0 },
    xaxis: {
      categories: dates,
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    tooltip: {
      theme: themeMode,
      fixed: { enabled: false },
      x: {
        show: true,
        formatter: (val, { dataPointIndex, w }) => {
          const dateStr = w.config.xaxis.categories[dataPointIndex];
          if (!dateStr) return "";
          const d = new Date(dateStr);
          return d.toLocaleDateString('default', { weekday: 'short', day: 'numeric', month: 'short' });
        }
      },
      y: {
        formatter: (val) => `₹${val.toLocaleString()}`,
        title: { formatter: () => '' }
      },
      marker: { show: false }
    },
    colors: [color]
  };

  return (
    <div className="sparkline-wrapper">
      <ReactApexChart options={options} series={series} type="line" height={80} width="100%" />
    </div>
  );
};

const SummaryCards = ({ summary, transactions }) => {
  const { theme } = useTheme();

  const stats = useMemo(() => {
    if (summary) return summary;
    if (!transactions || transactions.length === 0) {
      return { balance: 0, income: 0, expense: 0 };
    }

    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      balance: income - expense,
      income,
      expense,
    };
  }, [summary, transactions]);

  const trends = useMemo(() => {
    if (!transactions || transactions.length === 0) return { balanceData: [] };

    const dailyData = transactions.reduce((acc, t) => {
      const date = t.date;
      if (!acc[date]) acc[date] = { income: 0, expense: 0 };
      if (t.type === "income") acc[date].income += t.amount;
      else acc[date].expense += t.amount;
      return acc;
    }, {});

    const sortedDates = Object.keys(dailyData).sort();
    let cumulativeBalance = 0;

    const balanceData = sortedDates.map(date => {
      cumulativeBalance += (dailyData[date].income - dailyData[date].expense);
      return { x: date, y: cumulativeBalance };
    });

    return { balanceData };
  }, [transactions]);

  const formatCurrency = (val) => `₹${(val || 0).toLocaleString()}`;

  const cards = [
    {
      title: "Active Balance",
      value: formatCurrency(stats.balance),
      icon: <HiCurrencyRupee />,
      color: "#7b46bc",
      type: "balance",
      trend: trends.balanceData
    },
    {
      title: "Monthly Income",
      value: formatCurrency(stats.income),
      icon: <HiTrendingUp />,
      color: "#10b981",
      type: "income",
      trend: trends.balanceData
    },
    {
      title: "Monthly Expenses",
      value: formatCurrency(stats.expense),
      icon: <HiTrendingDown />,
      color: "#f43f5e",
      type: "expense",
      trend: trends.balanceData
    },
  ];

  return (
    <div className="summary">
      {cards.map((card, index) => (
        <div key={index} className="card summary-card fade-in">
          <div className="card-header-row">
            <div className="card-icon-titles">
              <div className={`icon-box ${card.type}-icon`}>
                {card.icon}
              </div>
              <div className="card-header-titles">
                <h4 className="card-main-title">{card.title}</h4>
                <p className="card-sub-title">Real-time update</p>
              </div>
            </div>

            <div className="card-value-display">
              <h2 className="card-amount-text">{card.value}</h2>
            </div>
          </div>

          <div className="card-chart-footer">
            <Sparkline data={card.trend} color={card.color} themeMode={theme} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;