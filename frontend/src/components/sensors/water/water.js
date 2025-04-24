import React, { useState, useEffect } from "react";
import style from './water.module.css';

const WaterLevel = ({ data }) => {
  const [level, setLevel] = useState(50); // ระดับน้ำเริ่มต้น (%)

  const getWaterColor = () => {
    if (level < 20) return "#ff4d4d"; // สีฟ้า
    if (level < 50) return "#ffc107"; // สีเหลือง
    return "#23d7ff"; // สีแดง
  };

  useEffect(() => {
    if (data) {
      let value = 0;
      if (data.distance < 5) {
        value = 100;
      } else if (data.distance <= 10) {
        value = 100 - ((data.distance - 5) * 100) / (21 - 5);
      } else if (data.distance <= 15) {
        value = 100 - ((data.distance - 5) * 100) / (21 - 5);
      } else if(data.distance <= 18){
        value = 100 - ((data.distance - 5) * 100) / (21 - 5);
      }else if(data.distance <= 21 ){
        value = 100 - ((data.distance - 5) * 100) / (21 - 5);
      }else{
        value = 0;
      }      

      setLevel(value); 
    }
  }, [data]);

  return (
    <div className={style.circle_container}>
      <div
        className={style.wave_wrapper}
        style={{ height: `${level}%` ,backgroundColor : getWaterColor()}}
      >
      </div>

      <div className={style.water_level}>
        {Math.floor(level)}%
      </div>
    </div>
  );
};

export default WaterLevel;
