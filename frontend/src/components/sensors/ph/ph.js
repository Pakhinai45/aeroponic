import React from "react";

const PH = ({data}) => {
  return (
    <div>
      {data ? (
        <div>
          <p style={{color:'red'}}>PH: {data.pH}%</p>
        </div>
      ) : (
        <p style={{color:"#1D3322"}}>Loading sensor data...</p>
      )}
    </div>
  );
};

export default PH;
