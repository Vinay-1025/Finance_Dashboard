import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";
import "./Layout.css";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="layout">
      <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <div 
        className={`sidebar-overlay ${isSidebarOpen && window.innerWidth <= 768 ? "visible" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <div className={`main ${isSidebarOpen ? "expanded" : "collapsed"}`}>
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;