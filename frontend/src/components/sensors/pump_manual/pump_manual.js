import React, { useEffect, useState } from "react";
import axios from 'axios';
import style from './pump_manual.module.css';

const PumpManual = ({ data }) => {
  const [isFlowData, setIsFlowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(null); // เพิ่ม state สำหรับ mode

  // ดึงข้อมูลเซ็นเซอร์และ mode
  useEffect(() => {
    if (!data?.pid) return;

    const fetchData = async () => {
      try {
        const [sensorRes, modeRes] = await Promise.all([
          axios.get(`http://192.168.74.198:3300/sensor/${data.pid}`),
          axios.get(`http://192.168.74.198:3300/getPumpMode/${data.pid}`)
        ]);

        setIsFlowData(sensorRes.data);
        setMode(modeRes.data.mode || 'manual'); // ตั้งค่า mode
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [data?.pid]);

  const handleTogglePump = async () => {
    if (!isFlowData || typeof isFlowData.pumpState !== 'boolean') return;

    const newPumpState = !isFlowData.pumpState;

    try {
      await axios.post('http://192.168.74.198:3300/togglePump', {
        pid: isFlowData.pid,
        pumpState: newPumpState
      });

      setIsFlowData(prevData => ({
        ...prevData,
        pumpState: newPumpState
      }));
    } catch (error) {
      console.error('Error toggling pump:', error);
    }
  };

  const pumpState = isFlowData?.pumpState;

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      {loading ? (
        <p className={style.load}>กำลังโหลดข้อมูล...</p>
      ) : isFlowData ? (
        <>
          {mode === 'manual' ? (
            <>
              <p className={style.statusOff}>OFF</p>
              <label className={style.switch}>
                <input
                  type="checkbox"
                  checked={pumpState}
                  onChange={handleTogglePump}
                />
                <span className={style.slider}></span>
              </label>
              <p className={style.statusOn}>ON</p>
            </>
          ) : (
            <p className={style.warn}>Pump cannot be controlled in this mode.</p>
          )}
        </>
      ) : (
        <p className={style.warn}>ไม่สามารถโหลดข้อมูลจากเซ็นเซอร์ได้</p>
      )}
    </div>
  );
};

export default PumpManual;
