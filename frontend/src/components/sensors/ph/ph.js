import React from "react";
import style from "./ph.module.css"

const PH = ({data}) => {
  return (
    // <div>
    //   {data ? (
    //     <div>
    //       <p style={{color:'red'}}>PH: {data.pH}%</p>
    //     </div>
    //   ) : (
    //     <p style={{color:"#1D3322"}}>Loading sensor data...</p>
    //   )}
    // </div>

    <div className={style.ph_container}>
      <div className={style.ph_bar}>
        <div className={style.ph_level} style={{ backgroundColor: 'hsl(0, 80%, 50%)' }}>1</div>
        <div className={style.ph_level} style={{ backgroundColor: 'hsl(20, 80%, 50%)' }}>2</div>
        <div className={style.ph_level} style={{ backgroundColor: 'hsl(40, 80%, 50%)' }}>3</div>
        <div className={style.ph_level} style={{ backgroundColor: 'hsl(60, 80%, 50%)' }}>4</div>
        <div className={style.ph_level} style={{ backgroundColor: 'hsl(80, 80%, 50%)' }}>5</div>
        <div className={style.ph_level} style={{ backgroundColor: 'hsl(100, 80%, 50%)' }}>6</div>
        <div className={style.ph_level} style={{ backgroundColor: 'hsl(120, 80%, 50%)' }}>7</div>
        <div className={style.ph_level} style={{ backgroundColor: 'hsl(140, 80%, 50%)' }}>8</div>
        <div className={style.ph_level} style={{ backgroundColor: 'hsl(160, 80%, 50%)' }}>9</div>
        <div className={style.ph_level} style={{ backgroundColor: 'hsl(180, 80%, 50%)' }}>10</div>
        <div className={style.ph_level} style={{ backgroundColor: 'hsl(200, 80%, 50%)' }}>11</div>
        <div className={style.ph_level} style={{ backgroundColor: 'hsl(220, 80%, 50%)' }}>12</div>
        <div className={style.ph_level} style={{ backgroundColor: 'hsl(240, 80%, 50%)' }}>13</div>
        <div className={style.ph_level} style={{ backgroundColor: 'hsl(260, 80%, 50%)' }}>14</div>
      </div>
      <div className={style.ph_indicator} id={style.ph_indicator}>▼</div>
    </div>

  );
};

export default PH;
