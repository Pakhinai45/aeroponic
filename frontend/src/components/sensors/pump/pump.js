import { useState, useEffect } from "react";
import style from "./pump.module.css";
import axios from "axios";

import PumpAuto from "../pump_auto/pump_auto";
import PumpManual from "../pump_manual/pump_manual";

const Pump = ({ data }) => {
  const [pageMode,setPageMode] = useState(null);
  const [mode,setMode] = useState("");

  useEffect(() => {
    const fetchMode = async () => {
      try {
        const res = await axios.get(`http://localhost:3300/getPumpMode/${data.pid}`);
        // console.log("mode:",res.data);
        
        if (Array.isArray(res.data) && res.data.length > 0) {
          console.log("🔥 mode from API:", res.data[0].mode);
          setMode(res.data[0].mode);
        }
      } catch (error) {
        console.error("Failed to fetch pump mode:", error);
      }
    };
    fetchMode();
  }, [data.pid]);

  const handleDropdownChange = async (e) => {
  const selectedMode = e.target.value;
  if (selectedMode === mode) return; // ถ้าเลือกค่าเดิม ไม่ต้องทำอะไร

  try {
    await axios.post("http://localhost:3300/setPumpMode", {
      pid: data.pid,
      mode: selectedMode,
    });
    setMode(selectedMode);
  } catch (err) {
    console.error("Error updating mode:", err);
  }
};


  return (
    <div>
      <div className={style.mode}>
        <label htmlFor="mode-select" className={style.label}>Select Mode </label>
        <select id="mode-select" value={mode} onChange={handleDropdownChange} className={style.select}>
          <option value="auto">Auto</option>
          <option value="manual">Manual</option>
        </select>
      </div>


      {pageMode === null &&(
        <div>
          <button className={style.button} onClick={()=> setPageMode("auto")}>Auto</button>
          <button className={style.button2} onClick={()=> setPageMode("manual")}>Manual</button>
        </div>
      )}
      
      {pageMode === "auto" &&(
        <div>
            <PumpAuto data={data} onClose={()=> setPageMode(null)}></PumpAuto>
        </div>
      )}
      
      {pageMode === "manual" &&(
        <div>
          <PumpManual data={data}></PumpManual>
          <button className={style.buttonBack} onClick={()=>setPageMode(null)}>Back</button>
        </div>
      )}

    </div>
  );
};

export default Pump;
