import cron from 'node-cron'; //ใช้สำหรับตั้งเวลาในการรันฟังก์ชันซ้ำ ๆ
import axios from 'axios';
import { getDocs, doc, collection, getDoc } from 'firebase/firestore';
import { db } from "../firebase/firebaseConfig.js"; //นำเข้า object db ที่เป็นตัวเชื่อมต่อกับ Firebase Firestore

const getSchedulesForAllDevices = async () => {
  const snapshot = await getDocs(collection(db, 'pump_schedules')); 

  const devices = []; //เก็บข้อมูลตารางเวลาและ mode ของแต่ละอุปกรณ์
 
  for (const docSnap of snapshot.docs) { //ลูปผ่าน document แต่ละตัวใน pump_schedules
    const pid = docSnap.id; //เก็บ ID ของอุปกรณ์ (PID)
    const scheduleSnapshot = await getDocs(collection(db, 'pump_schedules', pid, 'schedules')); 
    const schedules = scheduleSnapshot.docs.map(d => d.data()); //แปลงเอกสารเป็น array ของ schedule objects

    // ดึง mode ของอุปกรณ์จาก Firestore
    const deviceDoc = await getDoc(doc(db, 'pump_schedules', pid));
    const mode = deviceDoc.exists() ? deviceDoc.data().mode || 'manual' : 'manual'; //ตรวจสอบว่ามี mode หรือไม่ ถ้าไม่มีให้ใช้ 'manual' เป็นค่า default

    //เก็บข้อมูลของอุปกรณ์รวมกับตารางเวลาและ mode ไว้ใน array devices
    devices.push({ pid: pid, schedules, mode });
  }

  return devices;
};

cron.schedule('* * * * *', async () => {
  //ดึงวันและเวลาในรูปแบบที่ใช้เปรียบเทียบกับตารางเวลา
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  const currentTime = now.toTimeString().slice(0, 5);

  console.log(`Checking schedule at ${currentDay} ${currentTime}`);

  try {
    const allDevices = await getSchedulesForAllDevices();

    for (const { pid: pid, schedules, mode } of allDevices) { //ลูปผ่านแต่ละอุปกรณ์

      if (mode !== 'auto') { //ถ้าอุปกรณ์ไม่ได้ตั้งเป็น auto ให้ข้ามไป
        console.log(`Skipping ${pid} (mode: ${mode})`);
        continue;
      }

      for (const schedule of schedules) {
        if (schedule.day === currentDay) { //ตรวจสอบว่าวันในตารางตรงกับวันปัจจุบันหรือไม่
          if (schedule.onTime === currentTime) { //ตรวจสอบว่าเวลาเปิดตรงกับเวลาปัจจุบันหรือไม่
            console.log(`Auto Turn ON for ${pid}`);
            await axios.post('http://localhost:3300/togglePump', {
              pid: pid,
              pumpState: true,
              mode: "auto"
            });
          } else if (schedule.offTime === currentTime) { //ตรวจสอบว่าเวลาปิดตรงกับเวลาปัจจุบันหรือไม่
            console.log(`Auto Turn OFF for ${pid}`);
            await axios.post('http://localhost:3300/togglePump', {
              pid: pid,
              pumpState: false,
              mode: "auto"
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Scheduler error:', error.message);
  }
});
