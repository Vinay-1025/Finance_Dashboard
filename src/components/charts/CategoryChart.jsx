import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { FaChartPie, FaList } from "react-icons/fa";
import useTheme from "../../hooks/useTheme";
import "./CategoryChart.css";

const CategoryChart = ({ transactions }) => {
  const { theme } = useTheme();
  const [viewType, setViewType] = useState('list');
  
  const categoryMap = {};

  transactions.forEach((t) => {
    if (t.type === "expense") {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    }
  });

  const labels = Object.keys(categoryMap);
  const series = Object.values(categoryMap);
  const colors = ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];

  const totalExpense = series.reduce((a, b) => a + b, 0);

  const listItems = labels.map((label, index) => {
    const value = series[index];
    const percentage = totalExpense === 0 ? 0 : ((value / totalExpense) * 100).toFixed(1);
    return {
      label,
      value,
      percentage,
      color: colors[index % colors.length]
    };
  }).sort((a,b) => b.value - a.value);

  const options = {
    chart: {
      type: 'donut',
      background: 'transparent',
      fontFamily: 'Inter, sans-serif'
    },
    theme: { mode: theme },
    labels: labels,
    colors: colors,
    stroke: { show: false },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            name: { show: true, color: 'var(--text-muted)' },
            value: { show: true, color: 'var(--text-main)', formatter: (val) => `₹${val}` },
            total: {
              show: true,
              label: 'Total',
              color: 'var(--text-muted)',
              formatter: () => `₹${totalExpense}`
            }
          }
        }
      }
    },
    tooltip: { theme: theme },
    legend: { position: 'bottom', labels: { colors: 'var(--text-main)' } }
  };

  return (
    <div className="card chart-card">
      <div className="chart-header">
        <h4 style={{ margin: 0, color: "var(--text-main)" }}>Spending Breakdown</h4>
        <button 
          className="icon-btn" 
          onClick={() => setViewType(viewType === 'chart' ? 'list' : 'chart')}
          title={viewType === 'chart' ? "Show Progress Bars" : "Show Pie Chart"}
        >
          {viewType === 'chart' ? <FaList /> : <FaChartPie />}
        </button>
      </div>
      
      <div className="chart-container" style={{ minHeight: "280px", marginTop: "20px" }}>
        {viewType === 'chart' ? (
           <ReactApexChart options={options} series={series} type="donut" height={280} />
        ) : (
           <div className="progress-list">
             {listItems.length === 0 ? (
               <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No expenses to breakdown.</p>
             ) : (
               listItems.map((item, i) => (
                 <div key={i} className="progress-item">
                   <div className="progress-header">
                     <span>{item.label}</span>
                     <span className="progress-val">₹{item.value} ({item.percentage}%)</span>
                   </div>
                   <div className="progress-bar-bg">
                     <div 
                       className="progress-bar-fill" 
                       style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                     ></div>
                   </div>
                 </div>
               ))
             )}
           </div>
        )}
      </div>
    </div>
  );
};

export default CategoryChart;