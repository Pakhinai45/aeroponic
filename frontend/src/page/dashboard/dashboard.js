import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Autocomplete, TextField } from "@mui/material";
import { FaSeedling } from "react-icons/fa";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

import Sidebar from "../../components/sidebar/Sidebar";
import style from "./dashboard.module.css";

import Humidity from "../../components/sensors/humidity/humidity";
import Light from "../../components/sensors/light/light";
import PH from "../../components/sensors/ph/ph";
import Temperature from "../../components/sensors/temper/temper";
import ControSwitch from "../../components/sensors/contro_switch/contro_switch";
import WaterLevel from "../../components/sensors/water/water";
import PumpTime from "../../components/sensors/pump_time/pump_time"


const CustomGrid = ({ size, height, children, rowGap }) => (
  <Grid
    size={size}
    height={height}
    rowGap={rowGap}
    sx={{ border: "2px solid #70807F", 
          borderRadius: "8px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
    backgroundColor="#374151"
  >
    {children}
  </Grid>
);

function Dashboard() {
  const [sensorList, setSensorList] = useState([]);
  const [sensorId, setSensorId] = useState("");

  const [inputId, setInputId] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputVegName, setInputVegName] = useState("");
  const [inputLocation, setInputLocation] = useState("");

  const [sensorData, setSensorData] = useState(null);
  const [showAddSensorModel , setshowAddSensorModel] = useState(false);
  const selectedSensor = sensorList.find(sensor => sensor.id === sensorId);

  //
  useEffect(() => {
    axios.get("http://localhost:3300/sensor-id")
      .then(res => {
        if (res.data.sensors && res.data.sensors.length > 0) {
          setSensorList(res.data.sensors);
          setSensorId(res.data.sensors[0].id); 
        }
      })
      .catch(err => console.error("Error loading sensor list:", err));
  }, []);

  //
  useEffect(() => {
    if (!sensorId) return;

    const fetchData = () => {
      axios
        .get(`http://localhost:3300/sensor/${sensorId}`)
        .then((res) => {
          if (res.data && res.data.id === sensorId) {
            setSensorData(res.data);
          } else {
            setSensorData(null);
          }
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setSensorData(null);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [sensorId]);


  // เพิ่ม sensorId ใหม่
  const handleAddSensor = () => {
    if (!inputId.trim() || !inputName.trim() || !inputVegName.trim() || !inputLocation.trim()) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    axios.post("http://localhost:3300/sensor-id", { 
      sensorId: inputId,
      name : inputName,
      vegetableName : inputVegName,
      location : inputLocation,
    })
    .then(() => {
      //โหลดรายการ sensor ใหม่จาก backend
      return axios.get("http://localhost:3300/sensor-id");
    })
    .then((res) => {
      if (res.data.sensors && res.data.sensors.length > 0) {
        setSensorList(res.data.sensors);
        setSensorId(inputId);
        setInputId("");
        setInputName("");
        setInputVegName("");
        setInputLocation("");
        setshowAddSensorModel(false);
      }
    })
    .catch(err => {
      console.error("Error saving sensorId:", err);
      if (err.response?.data?.error === "Sensor ID already exists") {
        alert("Sensor ID นี้ถูกใช้ไปแล้ว");
      } else { 
        alert("ไม่มี Sensor ID ในระบบ");
      }
    });
  };

  return (
    <div className={style.grid}>
      <div className={style.sidebar_contrinner}>
        <Sidebar />
      </div>

      <div className={style.content}>
        
        <div className={style.plantDetails}>
          {/* dropdown เปลี่ยน sensorId */}
          {sensorList.length > 0 && (
            <div style={{ marginBottom: "1rem", marginTop: "1rem", width: 250 }}>
              <Autocomplete
                options={sensorList}
                getOptionLabel={(option) => option.name}
                value={selectedSensor || null}
                onChange={(event, newValue) => {
                  if (newValue) setSensorId(newValue.id);
                }}
                renderOption={(props, option) => (
                  <li {...props} style={{ display: "flex", alignItems: "center", }}>
                    <FaSeedling style={{ marginRight: 8, color: "green" }} />
                    {option.name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField 
                    {...params} label="Select" variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      style: { 
                        color: "#F4F5F6",
                        padding: "20px 8px", 
                        height: "36px",     
                       }, 
                    }}
                    InputLabelProps={{
                      style: { color: "#aaaaaa" }, // ✅ สี label
                    }}
                  />
                )}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#70807F', // ✅ สีเส้นขอบปกติ
                    },
                    '&:hover fieldset': {
                      borderColor: '#70807F', // ✅ ตอน hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#70807F', // ✅ ตอน focus
                    },
                  },
                  borderRadius: 2, // เพิ่มมุมโค้ง
                }}
              />
            </div>
          )}

          {selectedSensor && (
            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginRight:"50px"}}>
              <p><strong>Id :</strong> {selectedSensor.id}</p>
              <p><strong>Name :</strong> {selectedSensor.name}</p>
              <p><strong>Vegetable :</strong> {selectedSensor.vegetableName}</p>
              <p><strong>Location :</strong> {selectedSensor.location}</p>
              <p><strong>Date :</strong> {new Date(selectedSensor.createdAt).toLocaleString()}</p>
            </div>
          )}

          <Stack spacing={2} direction="row">
            <Button 
              variant="outlined" 
              onClick={() => {setshowAddSensorModel(true)}}
              style={{
                color:"#F4F5F6",
                borderColor: "#F4F5F6",
              }}
            >ADD<AddIcon/></Button>
          </Stack>
        </div>

        { showAddSensorModel && (
          <div className={style.model_overlay}>
            <div className={style.model_content}>
            <p>เพิ่มเเท่งปลูก</p>
            <input
              type="text"
              placeholder="Input SensorID"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              style={{ padding: "0.5rem"}}
            />
            <input
              type="text"
              placeholder="Input Name"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              style={{ padding: "0.5rem"}}
            />
            <input
              type="text"
              placeholder="Input Vegetable Name"
              value={inputVegName}
              onChange={(e) => setInputVegName(e.target.value)}
              style={{ padding: "0.5rem"}}
            />
            <input
              type="text"
              placeholder="Input Location"
              value={inputLocation}
              onChange={(e) => setInputLocation(e.target.value)}
              style={{ padding: "0.5rem"}}
            />

            <button onClick={handleAddSensor} className={style.confirm_btn}>ตกลง</button>
            <button onClick={() => setshowAddSensorModel(false)} className={style.cancel_btn}>ยกเลิก</button>
            </div>
          </div>
        )}


        {/* แสดงข้อมูล sensor */}
        {sensorId && sensorData ? (
          <Box sx={{ flexGrow: 2 }}>
            <Grid container spacing={1} >

              <CustomGrid size={2} height={200}>
                <div className={style.position_all} >
                  <p className={style.title} style={{left:"-20px"}}>Water Level</p>
                  <WaterLevel data={sensorData} />
                </div>
              </CustomGrid>

              <CustomGrid size={2} height={200}>
                <div className={style.position_all} >
                  <p className={style.title} style={{left:"-60px"}}>Temperature</p>
                 <Temperature data={sensorData} />
                </div>
              </CustomGrid>

              <CustomGrid size={2} height={200}>
                <div className={style.position_all}>
                <p className={style.title} style={{left:"-35px"}}>Humidity</p>
                  <Humidity data={sensorData} />
                </div>          
              </CustomGrid>

              <CustomGrid size={2} height={200}>
                <div className={style.position_all}>
                  <p className={style.title} style={{left:"-30px"}}>Light</p>
                  <Light data={sensorData} /> 
                </div>
              </CustomGrid>

              <CustomGrid size={4} height={200}>
                <div className={style.position_all}>
                  <p className={style.title} style={{left:"-5px"}}>Ph</p>
                  <PH data={sensorData} />
                </div>
              </CustomGrid>

              <CustomGrid size={8} height={350}>

              </CustomGrid>

              <Grid container item size={2} direction="column" spacing={1}>

                <CustomGrid size={24} height={200}>
                  <div className={style.position_all}>
                    <p className={style.title} style={{left:"-120px"}}>Pump Time</p>
                    <PumpTime data={sensorData}></PumpTime>
                  </div>
                </CustomGrid>
                  
                <CustomGrid size={24} height={140}>
                  <div className={style.position_all}>
                    <p className={style.title} style={{left:"-35px"}}>Switch</p>     
                    <ControSwitch data={sensorData} />
                  </div>
                </CustomGrid>
              </Grid>

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
