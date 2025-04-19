import { db } from "../firebase/firebaseConfig.js";
import { setDoc, doc, getDocs, collection} from 'firebase/firestore';


let sensorData = {};

// Mock Data สำหรับทดสอบ
const mockSensorData = {
    id : 'sensor02',
    distance: '120', 
    humidity: '55',  
    temperature: '23', 
    ldr: '300', 
    pH: '7.2', 
    pumpState: false, 
    isFlowing: false, 
  };

// POST sensorId
export const putSensorId = async (req, res) => {
    const { sensorId } = req.body;
    try {
        await setDoc(doc(db, 'plant_beds', sensorId) , {sensorId});
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET sensorIds ทั้งหมดใน plant_beds
export const getSensorId = async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'plant_beds'));

        const sensors = [];
        querySnapshot.forEach((doc) => {
            sensors.push({ id: doc.id, ...doc.data() });
        });

        res.json({ sensors });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Endpoint สำหรับรับข้อมูลเซ็นเซอร์
export const sensor = async (req, res) => {
    const { id, distance, humidity, temperature, ldr, pH, isFlowing } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Missing sensor ID' });
      }

      if (!sensorData[id]) {
        sensorData[id] = {
          distance: '',
          humidity: '',
          temperature: '',
          ldr: '',
          pH: '',
          pumpState: false,
          isFlowing: false
        };
      }

    // อัปเดตค่าที่ส่งมา
    if (distance !== undefined) sensorData[id].distance = distance;
    if (humidity !== undefined) sensorData[id].humidity = humidity;
    if (temperature !== undefined) sensorData[id].temperature = temperature;
    if (ldr !== undefined) sensorData[id].ldr = ldr;
    if (pH !== undefined) sensorData[id].pH = pH;
    if (isFlowing !== undefined) sensorData[id].isFlowing = isFlowing;

    console.log('------------------------------------');
    
    console.log(`--- [${id}] ---`);
    console.log(`Distance: ${sensorData[id].distance} cm`);
    console.log(`Humidity: ${sensorData[id].humidity}%`);
    console.log(`Temperature: ${sensorData[id].temperature}°C`);
    console.log(`LDR: ${sensorData[id].ldr}`);
    console.log(`pH: ${sensorData[id].pH}`);
    console.log(`Pump State: ${sensorData[id].pumpState}`);
    console.log(`Is Flowing: ${sensorData[id].isFlowing}`);

    res.json({ message: `Data from ${id} received.` });
};

// เปลี่ยนสถานะปั๊มของ ESP32 ที่ระบุ
// export const togglePump = async (req, res) => {
//     const { id, pumpState } = req.body;
  
//     if (!id || pumpState === undefined) {
//       return res.status(400).json({ success: false, error: 'Missing ID or pumpState' });
//     }
  
//     if (!sensorData[id]) {
//       sensorData[id] = {
//         distance: '',
//         humidity: '',
//         temperature: '',
//         ldr: '',
//         pH: '',
//         pumpState: false,
//         isFlowing: false
//       };
//     }
  
//     sensorData[id].pumpState = pumpState;
//     sensorData[id].isFlowing = pumpState ? 1 : 0;
  
//     console.log(`Pump state for ${id} updated to: ${pumpState}`);
  
//     res.json({ success: true });
//   };

// รับข้อมูลของ ESP32 ตาม ID
export const getDataById = async (req, res) => {
    const id = req.params.id;
    if (sensorData[id]) {
      res.json(sensorData[id]);
    } else {
      res.status(404).json({ error: 'Sensor ID not found' });
    }
  };


