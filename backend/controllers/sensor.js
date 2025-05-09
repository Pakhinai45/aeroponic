import { db } from "../firebase/firebaseConfig.js";
import { setDoc, doc, getDocs, getDoc, collection, addDoc} from 'firebase/firestore';

let sensorData = {};

// POST sensorId
export const putSensorId = async (req, res) => {
  const { sensorId, name, vegetableName, location } = req.body;

    if (!sensorId || sensorId.trim() === '') {
        return res.status(400).json({ success: false, error: 'Sensor ID is required' });
    }

    try {
        // เช็คว่า sensorId มีอยู่ใน Firestore แล้วไหม
        const docRef = doc(db, 'plant_beds', sensorId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return res.status(400).json({ success: false, error: 'Sensor ID already exists in Firestore' });
        }

        // เช็คว่า sensorId มีอยู่ใน sensorData (จาก ESP32 ส่งมาหรือยัง)
        if (!sensorData[sensorId]) {
            return res.status(400).json({ success: false, error: 'Sensor ID has not sent any data yet from ESP32' });
        }

        // ผ่านทั้ง 2 เงื่อนไข —> เพิ่มลง Firestore
        await setDoc(docRef, { 
          sensorId,
          name,
          vegetableName,
          location,
          createdAt : new Date().toISOString() 
        });
        res.json({ success: true });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
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

    
    if (distance !== undefined) sensorData[id].distance = distance;
    if (humidity !== undefined) sensorData[id].humidity = humidity;
    if (temperature !== undefined) sensorData[id].temperature = temperature;
    if (ldr !== undefined) sensorData[id].ldr = ldr;
    if (pH !== undefined) sensorData[id].pH = pH;
    if (isFlowing !== undefined) sensorData[id].isFlowing = isFlowing;

    sensorData[id].updatedAt = new Date().toISOString();

    console.log('------------------------------------');
    console.log(`--- [${id}] ---`);
    console.log(`Distance: ${sensorData[id].distance} cm`);
    console.log(`Humidity: ${sensorData[id].humidity}%`);
    console.log(`Temperature: ${sensorData[id].temperature}°C`);
    console.log(`LDR: ${sensorData[id].ldr}`);
    console.log(`pH: ${sensorData[id].pH}`);
    console.log(`Pump State: ${sensorData[id].pumpState}`);
    console.log(`Is Flowing: ${sensorData[id].isFlowing}`);
    console.log(`time is :${sensorData[id].updatedAt}`)

    res.json({ message: `Data from ${id} received.` });

    await saveSensorToFirestore(id);

};

const saveSensorToFirestore = async (id) => {
  const now = Date.now();
  const rec_time = 60 * 5000;

  if (!sensorData[id].lastSaved) sensorData[id].lastSaved = 0;

  if (now - sensorData[id].lastSaved >= rec_time) {
    try {
      // 🔥 แก้ตรงนี้ — ใช้ addDoc กับ collection reference
      const sensorDataCollection = collection(db, 'sensor', id, 'data');

      await addDoc(sensorDataCollection, {
        distance: sensorData[id].distance,
        humidity: sensorData[id].humidity,
        temperature: sensorData[id].temperature,
        ldr: sensorData[id].ldr,
        pH: sensorData[id].pH,
        isFlowing: sensorData[id].isFlowing,
        pumpState: sensorData[id].pumpState,
        timestamp: new Date().toISOString()
      });

      sensorData[id].lastSaved = now;
      console.log(`✔️ Firestore saved for [${id}]`);
    } catch (error) {
      console.error(`❌ Error saving to Firestore for [${id}]:`, error);
    }
  } else {
    console.log(`⏱ Skipped Firestore save for [${id}] (<5 min)`);
  }
};


// เปลี่ยนสถานะปั๊มของ ESP32 ที่ระบุ
export const togglePump = async (req, res) => {
    const { id, pumpState } = req.body;
  
    if (!id || pumpState === undefined) {
      return res.status(400).json({ success: false, error: 'Missing ID or pumpState' });
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
  
    sensorData[id].pumpState = pumpState;
    sensorData[id].isFlowing = pumpState ? 1 : 0;
  
    console.log(`Pump state for ${id} updated to: ${pumpState}`);
  
    res.json({ success: true });
  };


// รับข้อมูลของ ESP32 ตาม ID
export const getDataById = async (req, res) => {
  const id = req.params.id;
  if (sensorData[id]) {
    res.json({ id, ...sensorData[id] }); 
  } else {
    res.status(404).json({ error: 'Sensor ID not found' });
  }
};



