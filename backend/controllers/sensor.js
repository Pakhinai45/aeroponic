import { db } from "../firebase/firebaseConfig.js";
import { setDoc, doc, getDocs, getDoc, collection, addDoc, deleteDoc, updateDoc} from 'firebase/firestore';

let sensorData = {};

// POST sensorId ------------------------------------------------------------------------------------------------------------
export const putSensorId = async (req, res) => {
  const { pid, beds_name, vegetableName, location } = req.body;

    if (!pid || pid.trim() === '') {
        return res.status(400).json({ success: false, error: 'Sensor ID is required' });
    }

    try {
        const docRef = doc(db, 'plant_beds', pid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return res.status(400).json({ success: false, error: 'Sensor ID already exists in Firestore' });
        }

        // เช็คว่า pid มีอยู่ใน sensorData (จาก ESP32 ส่งมาหรือยัง)
        if (!sensorData[pid]) {
            return res.status(400).json({ success: false, error: 'Sensor ID has not sent any data yet from ESP32' });
        }

        await setDoc(docRef, { 
          pid: pid,
          beds_name,
          vegetableName,
          location,
          createdAt : new Date().toISOString() 
        });
        res.json({ success: true });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// GET pid ทั้งหมดใน plant_beds ------------------------------------------------------------------------------------------------------------
export const getSensorId = async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'plant_beds'));

        const plant_beds = [];
        querySnapshot.forEach((doc) => {
            plant_beds.push({ id: doc.id, ...doc.data() });
        });

        res.json({ plant_beds });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// รับข้อมูลเซ็นเซอร์จาก esp32 --------------------------------------------------------------------------------------------
export const sensor = async (req, res) => {
    const { pid, distance, humidity, temperature, ldr, pH, isFlowing } = req.body;

    if (!pid) {
        return res.status(400).json({ error: 'Missing sensor ID' });
      }

      if (!sensorData[pid]) {
        sensorData[pid] = {
          distance: '',
          humidity: '',
          temperature: '',
          ldr: '',
          pH: '',
          pumpState: false,
          isFlowing: false
        };
      }

    
    if (distance !== undefined) sensorData[pid].distance = distance;
    if (humidity !== undefined) sensorData[pid].humidity = humidity;
    if (temperature !== undefined) sensorData[pid].temperature = temperature;
    if (ldr !== undefined) sensorData[pid].ldr = ldr;
    if (pH !== undefined) sensorData[pid].pH = pH;
    if (isFlowing !== undefined) sensorData[pid].isFlowing = isFlowing;

    console.log('------------------------------------');
    console.log(`--- [${pid}] ---`);
    console.log(`Distance: ${sensorData[pid].distance} cm`);
    console.log(`Humidity: ${sensorData[pid].humidity}%`);
    console.log(`Temperature: ${sensorData[pid].temperature}°C`);
    console.log(`LDR: ${sensorData[pid].ldr}`);
    console.log(`pH: ${sensorData[pid].pH}`);
    console.log(`Pump State: ${sensorData[pid].pumpState}`);
    console.log(`Is Flowing: ${sensorData[pid].isFlowing}`);

    res.json({ message: `Data from ${pid} received.` });

    await saveSensorToFirestore(pid);

};

// บันทึกข้อมูลเซ็นเซอร์ลงในฐานข้อมูล ----------------------------------------------------------------------------------
const saveSensorToFirestore = async (pid) => {
  const now = Date.now();
  const rec_time = 60 * 5000;

  if (!sensorData[pid].lastSaved) sensorData[pid].lastSaved = 0;

  if (now - sensorData[pid].lastSaved >= rec_time) {
    try {
    
      const sensorDataCollection = collection(db, 'sensor', pid, 'data');

      await addDoc(sensorDataCollection, {
        distance: sensorData[pid].distance,
        humidity: sensorData[pid].humidity,
        temperature: sensorData[pid].temperature,
        ldr: sensorData[pid].ldr,
        pH: sensorData[pid].pH,
        flowing: sensorData[pid].isFlowing,
        pump_state: sensorData[pid].pumpState,
        date: new Date().toISOString()
      });

      sensorData[pid].lastSaved = now;
      console.log(`Firestore saved for [${pid}]`);
    } catch (error) {
      console.error(`Error saving to Firestore for [${pid}]:`, error);
    }
  } else {
    console.log(`Skipped Firestore save for [${pid}] (<5 min)`);
  }
};


// เปลี่ยนสถานะปั๊มของ ESP32 ------------------------------------------------------------------------------------------------------------
export const togglePump = async (req, res) => {
    const { pid, pumpState } = req.body;
  
    if (!pid || pumpState === undefined) {
      return res.status(400).json({ success: false, error: 'Missing ID or pumpState' });
    }
  
    if (!sensorData[pid]) {
      sensorData[pid] = {
        distance: '',
        humidity: '',
        temperature: '',
        ldr: '',
        pH: '',
        pumpState: false,
        isFlowing: false
      };
    }
  
    sensorData[pid].pumpState = pumpState;
    sensorData[pid].isFlowing = pumpState ? 1 : 0;
  
    console.log(`Pump state for ${pid} updated to: ${pumpState}`);
  
    res.json({ success: true });
  };


// รับข้อมูลของ ESP32 ตาม ID -------------------------------------------------------------------------
export const getDataById = async (req, res) => {
  const pid = req.params.pid;
  if (sensorData[pid]) {
    res.json({ pid, ...sensorData[pid] }); 
  } else {
    res.status(404).json({ error: 'Sensor ID not found' });
  }
};


// บันทึกเวลาการทำงานของปั๊มน้ำ -------------------------------------------------------------------------------
export const saveSchedules = async (req, res) => {
  const { pid } = req.params;
  const { onTime, offTime, day } = req.body;

  try {
    const ref = collection(db,"pump_schedules", pid, "schedules");
                
    const docRef = await addDoc(ref,{
      onTime,
      offTime,
      day,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ดึงเวลาการทำงานของปั๊มน้ำจากฐานข้อมูล -------------------------------------------------------------------------------
export const getSchedules = async (req, res) => {
  const { pid } = req.params; 

  try {
    const ref = collection(db, 'pump_schedules', pid, 'schedules');
    const snapshot = await getDocs(ref);

    const schedules = [];
    snapshot.forEach((doc) => {
      schedules.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json({ schedules });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ลบเวลาการทำงานของปั๊มน้ำ -------------------------------------------------------------------------------
export const deleteSchedule = async (req, res) => {
  const { pid, scheduleId } = req.params; 

  try {
    const docRef = doc(db, "pump_schedules", pid, "schedules", scheduleId);
    await deleteDoc(docRef);

    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// เเก้ไขเวลาการทำงานของปั๊มน้ำ -------------------------------------------------------------------------------
export const updateSchedule = async (req, res) => {
  const { pid, scheduleId } = req.params;
  const { onTime, offTime, day } = req.body;

  try {
    const docRef = doc(db, "pump_schedules", pid, "schedules", scheduleId);

    await updateDoc(docRef, {
      onTime,
      offTime,
      day,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: "Schedule updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//บันทึกโหมดการทำงานของปั๊มน้ำ -----------------------------------------------------------------------------------
export const setPumpMode = async (req, res) => {
  const { pid, mode } = req.body;

  if (!pid || !mode) {
    return res.status(400).json({ success: false, error: 'Missing ID or mode' });
  }

  try {
    const ref = doc(db, 'pump_schedules', pid);
    await setDoc(ref, { mode }, { merge: true });

    console.log(`Mode for ${pid} set to ${mode}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error setting mode:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ดึงโหมดการทำงานของปั้มน้ำจากฐานข้อมูล -------------------------------------------------------------------------
export const getPumpMode = async (req, res) => {
  const { pid } = req.params; 

  try {
    const docRef = doc(db, "pump_schedules", pid); 
    const docSnap = await getDoc(docRef);          

    if (!docSnap.exists()) {
      return res.json({ mode: "manual" });
    }

    const data = docSnap.data();
    res.json({ mode: data.mode || "manual" });
  } catch (error) {
    console.error("Error fetching pump mode from Firebase:", error);
    res.status(500).json({ error: "Failed to fetch mode" });
  }
};


