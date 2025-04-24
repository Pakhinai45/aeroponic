import React from "react";
import style from './humidity.module.css';

const Humidity = ({ data }) => {
  return (
    // <div>
    //   {data ? (
    //     <div>
    //       <p style={{ color: 'red' }}>Humidity: {data.humidity}%</p>
    //     </div>
    //   ) : (
    //     <p style={{ color: "#1D3322" }}>Loading sensor data...</p>
    //   )}
    // </div>
    <div className={style.drop}>
      <p className={style.data_sensor}>{Math.floor(data.humidity)}%</p>
    </div>
  );
};

export default Humidity;