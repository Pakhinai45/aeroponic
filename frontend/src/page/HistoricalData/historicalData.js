import * as React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./historicalData.css";

function HistoricalData() {
  return (
    <div className="grid">
      <div className="sidebar-contrinner">
        <Sidebar />
      </div>
      <div className="content">
      </div>
    </div>
  );
}

export default HistoricalData;
