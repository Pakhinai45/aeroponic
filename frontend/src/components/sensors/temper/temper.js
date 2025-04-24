import React from "react";
import style from "../temper/temper.module.css";
import sunIcon from "../../../icons/sun.png";

const Temperature = ({ data }) => {
  const temp = data?.temperature || 0;
  const mercuryHeight = `${Math.max(0, Math.min(100, temp))}%`;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>

      <img src={sunIcon} alt="Sun Icon" width={90} className={style.sunIcon} />

      <div className={style.temper}>

        <div className={style.mercury2}></div>

        <div className={style.mercury} style={{ height: mercuryHeight }}>
          <div className={style.mercury_head}></div>
        </div>

        <div className={style.bulb}></div>

        <div className={style.mark} style={{bottom:"30px" , width:"30px"}}></div>
        <div className={style.mark} style={{bottom:"40px" , width:"20px"}}></div>
        <div className={style.mark} style={{bottom:"50px" , width:"20px"}}></div>
        <div className={style.mark} style={{bottom:"60px" , width:"30px"}}></div>
        <div className={style.mark} style={{bottom:"70px" , width:"20px"}}></div>
        <div className={style.mark} style={{bottom:"80px" , width:"20px"}}></div>
        <div className={style.mark} style={{bottom:"90px" , width:"30px"}}></div>
        <div className={style.mark} style={{bottom:"100px" , width:"20px"}}></div>
        <div className={style.mark} style={{bottom:"110px" , width:"30px"}}></div>

        <p className={style.data_sensor}>
          {Math.floor(temp)}°C
        </p>
      </div>
    </div>
  );
};

export default Temperature;
