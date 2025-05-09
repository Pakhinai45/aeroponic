import React from "react";
import style from "./ph.module.css"

const PH = ({ data }) => {
  const totalWidth = 400;
  const numLevels = 14;
  const levelWidth = totalWidth / numLevels;

  let indicatorPosition = 0;

  if (data?.pH) {
    let position = (data.pH - 1) * levelWidth;
    indicatorPosition = Math.max(0, Math.min(position, totalWidth - levelWidth));
  }

  return (
    <div className={style.ph_container}>
      <div className={style.ph_bar}>
        {Array.from({ length: numLevels }, (_, index) => (
          <div
            key={index}
            className={style.ph_level}
            style={{ backgroundColor: `hsl(${index * 20}, 80%, 50%)` }}
          >
            {index + 1}
          </div>
        ))}
      </div>
      <p className={style.title}> Ph {data.pH}</p>
      <div
        className={style.ph_indicator}
        style={{ left: `${indicatorPosition}px` }}
      >
        ▼
      </div>
    </div>
  );
};

export default PH;
