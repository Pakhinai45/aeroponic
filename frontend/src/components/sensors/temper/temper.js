import React from "react";

const Temperature = ({ data }) => {
  return (
    <div>
      {data ? (
        <div>
          <p style={{color:'red'}}>Temperature: {data.temperature}%</p>
        </div>
      ) : (
        <p style={{color:"#1D3322"}}>Loading sensor data...</p>
      )}
    </div>
  );
};

export default Temperature;
