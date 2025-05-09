import React, { useEffect, useState } from "react";
import axios from 'axios';
import style from './contro_switch.module.css'; 

const ControSwitch = ({ data }) => {
  const [isFlowData, setIsFlowData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลจาก API
  useEffect(() => {
    if (!data?.id) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://192.168.74.198:3300/sensor/${data.id}`);
        setIsFlowData(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching isFlowing data:', error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [data?.id]);

  const handleTogglePump = async () => {
    if (!isFlowData || typeof isFlowData.pumpState !== 'boolean') return;

    const newPumpState = !isFlowData.pumpState;

    try {
      await axios.post('http://192.168.74.198:3300/togglePump', {
        id: isFlowData.id,
        pumpState: newPumpState
      });
      console.log('Pump state updated.');

      // รีเฟรชสถานะใหม่หลังจาก toggle ปั๊ม
      setIsFlowData(prevData => ({
        ...prevData,
        pumpState: newPumpState
      }));
    } catch (error) {
      console.error('Error toggling pump:', error);
    }
  };

  // กำหนดว่าเมื่อไหร่ที่น้ำไหล
  const isFlowing = String(isFlowData?.isFlowing) === "1";
  const pumpState = isFlowData?.pumpState;

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      {loading ? (
        <p>กำลังโหลดข้อมูล...</p>
      ) : isFlowData ? (
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

          <p className={style.title}>
            Pump Status: {isFlowing ? 'ON.' : 'OFF.'}
          </p>

          {/* แจ้งเตือนหากปั๊มเปิดแต่ไม่มีน้ำไหล */}
          {pumpState && !isFlowing && (
            <p style={{ color: 'red', marginTop: '10px' }}>
              ⚠️ น้ำไม่ไหล ปั๊มน้ำอาจไม่ทำงาน
            </p>
          )}
        </>
      ) : (
        <p>ไม่สามารถโหลดข้อมูลจากเซ็นเซอร์ได้</p>
      )}
    </div>
  );
};

export default ControSwitch;
