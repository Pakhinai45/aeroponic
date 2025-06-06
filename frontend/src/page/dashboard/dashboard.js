import { useState, useEffect } from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Autocomplete, TextField } from "@mui/material";
import { FaSeedling } from "react-icons/fa";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton,  } from '@mui/material';
import { Close } from '@mui/icons-material';

import Sidebar from "../../components/sidebar/Sidebar";
import style from "./dashboard.module.css";

import Humidity from "../../components/sensors/humidity/humidity";
import Light from "../../components/sensors/light/light";
import PH from "../../components/sensors/ph/ph";
import Temperature from "../../components/sensors/temper/temper";
import WaterLevel from "../../components/sensors/water/water";
import Pump from "../../components/sensors/pump/pump";
import RealtimeGraph from "../../components/sensors/graph/graph";
import PumpStatus from "../../components/sensors/pump_status/pump_status";


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

  const [inPutSensorId, setInPutSensorId] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputVegName, setInputVegName] = useState("");
  const [inputLocation, setInputLocation] = useState("");

  const [sensorData, setSensorData] = useState(null);
  const selectedSensor = sensorList.find(sensor => sensor.sensor_id === sensorId);

  const [openDialog, setOpenDialog] = useState(false);

  const openAddSensor = () => {
    setOpenDialog(true);
  };

  const closeAddSensor = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post("http://localhost:3300/api/authen",{},{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "ok") {
        // toast.success("Login Success",{toastId: "login-success"});
      } else {
        toast.error("Login failed",{toastId: "login-failed"});
        setTimeout(() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }, 4000);
      }
    } catch (err) {
      toast.error("Authentication error",{toastId: "auth-error"});
      setTimeout(() => {
          window.location.href = "/";
        }, 4000);
    }
  };

  checkAuth();
}, []);
  
//ดึงข้อมูลแท่งปลูก
useEffect(() => {
  const fetchSensorData = async () => {
    try {
      const response = await axios.get("http://localhost:3300/sensor-pid");
      if (response.data.length > 0) {
        // console.log("plant:",response.data);
        
        setSensorList(response.data);
        setSensorId(response.data[0].sensor_id);
      }
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };

  fetchSensorData();
}, []);

//ดึงข้อมูล sensor ตาม id
useEffect(() => {
  if (!sensorId) return;

  const fetchData = async () => {

    try {
      const response = await axios.get(`http://localhost:3300/sensor/${sensorId}`);
      // console.log("data is:",response.data);
      
      if (response.data && response.data.sensor_id === sensorId) {
        const matchedSensor = sensorList.find(sensor => sensor.sensor_id === sensorId);
        const dataWithPid = {
        ...response.data,
        pid: matchedSensor?.pid || null,
      };
        setSensorData(dataWithPid);
      } else {
        setSensorData(null);
      }
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      setSensorData(null);
    }

  };

  fetchData(); // เรียกทันทีตอนโหลด

  const interval = setInterval(fetchData, 1000); 
  return () => clearInterval(interval); // clear interval pid เปลี่ยน
}, [sensorId,sensorList]);


// เพิ่ม sensorId ใหม่
const handleAddSensor = async () => {

  if (!inPutSensorId.trim() || !inputName.trim() || !inputVegName.trim() || !inputLocation.trim()) {
    toast.warn(`Please fill in all information completely.`,{theme:"colored"});
    return;
  }
  try {
    await axios.post("http://localhost:3300/sensor-pid", { 
      sensor_id: inPutSensorId,
      bed_name : inputName,
      vegetableName : inputVegName,
      location : inputLocation,
    });

    toast.success(`Save SensorId Successfuly`);
    const response = await axios.get("http://localhost:3300/sensor-pid");

    if (response.data.length > 0) {
      setSensorList(response.data);
      setSensorId(inPutSensorId);
      setInPutSensorId("");
      setInputName("");
      setInputVegName("");
      setInputLocation("");
      closeAddSensor();
    }

  } catch (error) {
    console.error("Error saving sensorId:", error);
    if (error.response?.data?.error === "Sensor ID already exists") {
      toast.warn(`This sensor ID is already used.`);
    } else { 
      toast.warn(`There is no Sensor ID in the system.`);
    }
  }
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
                getOptionLabel={(option) => option.bed_name}
                value={selectedSensor || null}
                onChange={(event, newValue) => {
                  if (newValue) setSensorId(newValue.sensor_id);
                }}
                renderOption={(props, option) => (
                  <li {...props} style={{ display: "flex", alignItems: "center", }}>
                    <FaSeedling style={{ marginRight: 8, color: "green" }} />
                    {option.bed_name}
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
                      style: { color: "#aaaaaa" }, 
                    }}
                  />
                )}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#70807F', 
                    },
                    '&:hover fieldset': {
                      borderColor: '#70807F', 
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#70807F', 
                    },
                  },
                  borderRadius: 2, 
                }}
              />
            </div>
          )}

          {selectedSensor && (
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginRight:"20px"}}>
              <p><strong>ID :</strong> {selectedSensor.sensor_id}</p>
              <p><strong>Name :</strong> {selectedSensor.bed_name}</p>
              <p><strong>Vegetable :</strong> {selectedSensor.vegetable_name}</p>
              <p><strong>Location :</strong> {selectedSensor.location}</p>
              <p><strong>Creation Date :</strong> {new Date(selectedSensor.date).toLocaleString()}</p>
            </div>
          )}

          <Stack spacing={2} direction="row">
            <Button 
              variant="outlined" 
              onClick={openAddSensor}
              style={{
                color:"#F4F5F6",
                borderColor: "#F4F5F6",
              }}
            >ADD<AddIcon/></Button>
          </Stack>
        </div>

        {/*  */}
        <Dialog open={openDialog} onClose={closeAddSensor} maxWidth="sm" fullWidth>
          <DialogTitle>Add Sensor</DialogTitle>
          <Box position="absolute" top={0} right={0}>
            <IconButton onClick={closeAddSensor}>
              <Close />
            </IconButton>
          </Box>
          <DialogContent>
            <TextField
              label="SensorID"
              fullWidth
              type="text"
              value={inPutSensorId}
              onChange={(e) => setInPutSensorId(e.target.value)}
              sx={{mb:1}}
            />
            <TextField
              label="Name"
              fullWidth
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              sx={{mb:1}}
            />
            <TextField
              label="Vegetable Name"
              fullWidth
              type="text"
              value={inputVegName}
              onChange={(e) => setInputVegName(e.target.value)}
              sx={{mb:1}}
            />
            <TextField
              label="Location"
              fullWidth
              type="text"
              value={inputLocation}
              onChange={(e) => setInputLocation(e.target.value)}
              sx={{mb:1}}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={closeAddSensor}
              sx={{
                backgroundColor: '#830000',
                color: 'white',
                borderRadius: '20px',
                padding: '10px 20px',
                fontSize: '14px',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#b41515'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddSensor}
              sx={{
                backgroundColor: '#1D3322',
                color: 'white',
                borderRadius: '20px',
                padding: '10px 20px',
                fontSize: '14px',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#0d9719'
                }
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

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
                <div className={style.position_all}>
                    <p className={style.title} style={{left:"-120px"}}></p>
                    <RealtimeGraph data={sensorData}></RealtimeGraph>
                  </div>
              </CustomGrid>

              <Grid container size={2} direction="column" spacing={1}>
                <CustomGrid size={24} height={350}>
                  <div className={style.position_all}>
                    <p className={style.title} style={{left:"-200px"}}>Pump Configuration</p>
                    <Pump data={sensorData}></Pump>
                    <PumpStatus data={sensorData}></PumpStatus>
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
