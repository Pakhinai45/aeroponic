import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";

import Sidebar from "../../components/sidebar/Sidebar";
import "./dashboard.css";

import Humidity from "../../components/sensors/humidity/humidity";
import Light from "../../components/sensors/light/light";
import PH from "../../components/sensors/ph/ph";
import Temperature from "../../components/sensors/temper/temper";
import ControSwitch from "../../components/sensors/contro_switch/contro_switch";
import WaterLevel from "../../components/sensors/water/water";

const CustomGrid = ({ size, height, children, rowGap }) => (
  <Grid
    size={size}
    height={height}
    rowGap={rowGap}
    sx={{ border: "2px solid #70807F", borderRadius: "8px" }}
    backgroundColor="#FFFFFF"
  >
    {children}
  </Grid>
);

function Dashboard() {
  const [sensorList, setSensorList] = useState([]);
  const [sensorId, setSensorId] = useState("");
  const [inputId, setInputId] = useState("");
  const [sensorData, setSensorData] = useState(null);

  // โหลดรายการ sensorId ทั้งหมด
  useEffect(() => {
    axios.get("http://localhost:3300/sensor-id")
      .then(res => {
        if (res.data.sensors && res.data.sensors.length > 0) {
          setSensorList(res.data.sensors);
          setSensorId(res.data.sensors[0].id); // ใช้ตัวแรกเป็นค่าเริ่มต้น
        }
      })
      .catch(err => console.error("Error loading sensor list:", err));
  }, []);

  // โหลดข้อมูล sensor ตาม sensorId
  useEffect(() => {
    if (!sensorId) return;

    const fetchData = () => {
      axios
        .get(`http://localhost:3300/sensor/${sensorId}`)
        .then((res) => {
          setSensorData(res.data);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [sensorId]);

  // เพิ่ม sensorId ใหม่
  const handleAddSensor = () => {
    if (!inputId.trim()) return;

    axios.post("http://localhost:3300/sensor-id", { sensorId: inputId })
      .then(() => {
        setSensorList(prev => [...prev, { id: inputId }]);
        setSensorId(inputId);
        setInputId("");
      })
      .catch(err => {
        console.error("Error saving sensorId:", err);
      });
  };

  return (
    <div className="grid-dashboard">
      <div className="sidebar-contrinner">
        <Sidebar />
      </div>

      <div className="content-dashboard">
        {/* ช่องเพิ่ม sensorId */}
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="กรอก Sensor ID"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            style={{ padding: "0.5rem", marginRight: "1rem" }}
          />
          <button onClick={handleAddSensor}>เพิ่ม Sensor</button>
        </div>

        {/* dropdown เปลี่ยน sensorId */}
        {sensorList.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="sensorSelect">เลือก Sensor: </label>
            <select
              id="sensorSelect"
              value={sensorId}
              onChange={(e) => setSensorId(e.target.value)}
            >
              {sensorList.map(sensor => (
                <option key={sensor.id} value={sensor.id}>
                  {sensor.id}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* แสดงข้อมูล sensor */}
        {sensorId && sensorData ? (
          <Box sx={{ flexGrow: 2 }}>
            <Grid container spacing={1}>
              <CustomGrid size={4} height={200}>
                <WaterLevel data={sensorData} />
              </CustomGrid>
              <CustomGrid size={2} height={200}>
                <Humidity data={sensorData} />
              </CustomGrid>
              <CustomGrid size={2} height={200}>
                <Temperature data={sensorData} />
              </CustomGrid>
              <CustomGrid size={2} height={200}>
                <Light data={sensorData} />
              </CustomGrid>
              <CustomGrid size={2} height={200}>
                <PH data={sensorData} />
              </CustomGrid>
              <CustomGrid size={10} height={350}></CustomGrid>
              <CustomGrid size={2} height={200}>
                <ControSwitch data={sensorData} />
              </CustomGrid>
            </Grid>
          </Box>
        ) : (
          <p>ยังไม่มี sensor ถูกเลือกหรือไม่มีข้อมูล</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
