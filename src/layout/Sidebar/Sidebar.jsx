import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaExchangeAlt,
  FaChartPie,
  FaSignOutAlt,
  FaWallet
} from "react-icons/fa";
import { HiX } from "react-icons/hi";
import "./Sidebar.css";

const Sidebar = ({ isOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggle = () => setIsSidebarOpen(!isOpen);

  const handleNav = (path) => {
    navigate(path);
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <div className="sidebar-top">
        <div className="mobile-close" onClick={handleToggle}>
          <HiX />
        </div>
        <div className="logo-container">
          <img 
            src={isOpen ? "/zorvyn.png" : "/zorvyn-fav.png"} 
            alt="Zorvyn Logo" 
            className={`sidebar-logo ${!isOpen ? "collapsed-logo" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() => handleNav("/")}
          />
        </div>

        <ul className="menu">
          <li className={location.pathname === "/" ? "active" : ""} onClick={() => handleNav("/")}>
            <FaHome />
            {isOpen && <span>Dashboard</span>}
          </li>

          <li className={location.pathname === "/transactions" ? "active" : ""} onClick={() => handleNav("/transactions")}>
            <FaExchangeAlt />
            {isOpen && <span>Transactions</span>}
          </li>

          <li className={location.pathname === "/insights" ? "active" : ""} onClick={() => handleNav("/insights")}>
            <FaChartPie />
            {isOpen && <span>Insights</span>}
          </li>
        </ul>
      </div>

      <div className="sidebar-bottom">
        <div className="logout-btn">
          <FaSignOutAlt />
          {isOpen && <span>Logout</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;