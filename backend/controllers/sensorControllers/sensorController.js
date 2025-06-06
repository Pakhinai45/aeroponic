import { connection } from '../../db.js';
let sensorData = {};

// รับข้อมูลเซ็นเซอร์จาก esp32 ----------------------------------------------------------
export const sensor = async (req, res) => {
    const { sensor_id, distance, humidity, temperature, ldr, pH, isFlowing } = req.body;

    if (!sensor_id) {
        return res.status(400).json({ error: 'Missing sensor ID' });
      }

      if (!sensorData[sensor_id]) {
        sensorData[sensor_id] = {
          distance: '',
          humidity: '',
          temperature: '',
          ldr: '',
          pH: '',
          pumpState: false,
          isFlowing: false
        };
      }

    
    if (distance !== undefined) sensorData[sensor_id].distance = distance;
    if (humidity !== undefined) sensorData[sensor_id].humidity = humidity;
    if (temperature !== undefined) sensorData[sensor_id].temperature = temperature;
    if (ldr !== undefined) sensorData[sensor_id].ldr = ldr;
    if (pH !== undefined) sensorData[sensor_id].pH = pH;
    if (isFlowing !== undefined) sensorData[sensor_id].isFlowing = isFlowing;

    console.log('------------------------------------');
    console.log(`--- [${sensor_id}] ---`);
    console.log(`Distance: ${sensorData[sensor_id].distance} cm`);
    console.log(`Humidity: ${sensorData[sensor_id].humidity}%`);
    console.log(`Temperature: ${sensorData[sensor_id].temperature}°C`);
    console.log(`LDR: ${sensorData[sensor_id].ldr}`);
    console.log(`pH: ${sensorData[sensor_id].pH}`);
    console.log(`Pump State: ${sensorData[sensor_id].pumpState}`);
    console.log(`Is Flowing: ${sensorData[sensor_id].isFlowing}`);

    res.json({ message: `Data from ${sensor_id} received.` });

    // await saveSensorToFirestore(pid);
};

// เปลี่ยนสถานะปั๊มของ ESP32 --------------------------------------------------------------------
export const togglePump = async (req, res) => {
    const { sensor_id, pumpState } = req.body;
  
    if (!sensor_id || pumpState === undefined) {
      return res.status(400).json({ success: false, error: 'Missing ID or pumpState' });
    }
  
    if (!sensorData[sensor_id]) {
      sensorData[sensor_id] = {
        distance: '',
        humidity: '',
        temperature: '',
        ldr: '',
        pH: '',
        pumpState: false,
        isFlowing: false
      };
    }
  
    sensorData[sensor_id].pumpState = pumpState;
    sensorData[sensor_id].isFlowing = pumpState ? 1 : 0;
  
    console.log(`Pump state for ${sensor_id} updated to: ${pumpState}`);
  
    res.json({ success: true });
};

// รับข้อมูลของ ESP32 ตาม ID ----------------------------------------------------------------------
export const getDataById = async (req, res) => {
  const sensor_id = req.params.pid;
  if (sensorData[sensor_id]) {
    res.json({ sensor_id : sensor_id, ...sensorData[sensor_id] }); 
  } else {
    res.status(404).json({ error: 'Sensor ID not found' });
  }
};


// POST sensorId -----------------------------------------------------------------------------------------------
export const putSensorId = async (req, res) => {
  const { sensor_id, bed_name, vegetableName, location } = req.body;

  try {
    if (!sensorData[sensor_id]) { 
      return res.status(400).json({ success: false, error: 'Sensor ID has not sent any data yet from ESP32' });
    }

    const query = 'INSERT INTO plant_beds(sensor_id,bed_name,vegetable_name,location,mode) VALUES(?,?,?,?,?)';
    connection.query(query,[sensor_id,bed_name,vegetableName,location,"manual"] ,(err)=>{
      if (err) {
        console.error("Error insert data:",err);
        res.status(500).json({error:"Insert Server Error"});
        return;
      }
    });
    res.status(200).json({message:"Data insert successfuly",})
  } catch (error) {
     console.error("Error:", error);
     res.status(500).json({ message: error.message });
     return;
  }
}

// GET sensorId ทั้งหมดใน plant_beds ------------------------------------------------------------------------------------------------------------
export const getSensorId = async (req, res) => {
  try {
    const query = 'SELECT * FROM plant_beds';
    connection.query(query,(err,result)=>{
      if (err) {
        console.error("Error insert data:",err);
        res.status(500).json({error:"Insert Server Error"});
        return;
      }
      res.json(result);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
    return;
  }
}
