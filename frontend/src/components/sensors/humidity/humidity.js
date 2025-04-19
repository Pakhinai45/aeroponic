import React from "react";
import './humidity.css';

const Humidity = ({ data }) => {
  return (
    <div>
      {data ? (
        <div>
          <p style={{ color: 'red' }}>Humidity: {data.humidity}%</p>
        </div>
      ) : (
        <p style={{ color: "#1D3322" }}>Loading sensor data...</p>
      )}
    </div>
  );
};

export default Humidity;