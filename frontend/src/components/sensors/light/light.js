import React from "react";

const Light = ({data}) => {
  return (
    <div>
      {data ? (
        <div>
          <p style={{color:'red'}}>Light: {data.ldr}%</p>
        </div>
      ) : (
        <p style={{color:"#1D3322"}}>Loading sensor data...</p>
      )}
    </div>
  );
};

export default Light;
