import React from "react";
import style from "./light.module.css";
import sun from "../../../icons/sun2.png";
import sunCloud from "../../../icons/sunCloud.png";
import cloud from "../../../icons/cloud.png";
import moon from "../../../icons/half-moon.png";

const Light = ({ data }) => {
  // ฟังก์ชันแปลงค่า LDR เป็นระดับแสง
  const getLightLevel = (value) => {
    if (value < 1024) {
      return { label: "Sunny", icon: sun };
    } else if (value < 2048) {
      return { label: "Partly Cloudy", icon: sunCloud };
    } else if (value < 3072) {
      return { label: "Cloudy", icon: cloud };
    } else {
      return { label: "Night", icon: moon };
    }
  };

  if (!data) {
    return <p style={{ color: "#1D3322" }}>Loading sensor data...</p>;
  }

  const lightInfo = getLightLevel(data.ldr);

  return (
    <div className={style.lightContainer}>
      <img src={lightInfo.icon} alt={lightInfo.label} className={style.setImg} />
      <p className={style.lightText}>{lightInfo.label}</p>
      <p className={style.lightValue}>value : {data.ldr}</p>
    </div>
  );
};

export default Light;
