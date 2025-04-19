import React from "react";
// import { useSpring, animated } from "@react-spring/web";
import './water.css' 
import { data } from "react-router-dom";

const WaterLevel = ({data}) => {

  // const [level, setLevel] = useState(50); // ระดับน้ำเริ่มต้น (%)

  // Animation สำหรับระดับน้ำ
  // const animationProps = useSpring({
  //   to: { height: `${level}%` },
  //   from: { height: "0%" },
  //   config: { tension: 200, friction: 20 },
  // });

  // ฟังก์ชันสำหรับกำหนดสีของน้ำ
  // const getWaterColor = () => {
  //   if (level < 20) return "#ff4d4d"; // สีแดง
  //   if (level < 50) return "#ffc107"; // สีเหลือง
  //   return "#508dbc"; // สีฟ้า
  // };

  // const handleChange = (e) => {
  //   const value = Math.max(0, Math.min(100, e.target.value)); // จำกัดค่าให้อยู่ในช่วง 0-100
  //   setLevel(value);
  // };

  return (
    <div>
      {data ? (
        <div>
          <p style={{color:'red'}}>WaterLevel: {data.distance}%</p>
        </div>
      ) : (
        <p style={{color:"#1D3322"}}>Loading sensor data...</p>
      )}
    </div>

    // <div className="container">
    //   <div className="input-container">
    //     <label>Set Water Level (%): </label>
    //     <input
    //       type="number"
    //       value={level}
    //       onChange={handleChange}
    //     />
    //   </div>
    //   <div className="circle-container">
    //     {/* น้ำ */}
    //     <animated.div
    //       className="water"
    //       style={{
    //         backgroundColor: getWaterColor(), 
    //         ...animationProps,
    //       }}
    //     >
      
    //       {level < 100 && <div className="wave"></div>}
    //     </animated.div>
    //     <div className="water-level">
    //       {level}%
    //     </div>
    //   </div>
    //   <div>
    //   </div>
    // </div>
  );
};

export default WaterLevel;
