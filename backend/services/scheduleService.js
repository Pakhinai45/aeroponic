import { getDocs, collection } from 'firebase/firestore';
import { db } from "../firebase/firebaseConfig.js";

export const getSchedulesForAllDevices = async () => {
  const allSchedules = [];
  const pumpRef = collection(db, 'pump_schedules');
  const snapshot = await getDocs(pumpRef);

  for (const doc of snapshot.docs) {
    const sensorId = doc.id;
    const schedulesRef = collection(db, 'pump_schedules', sensorId, 'schedules');
    const scheduleSnap = await getDocs(schedulesRef);

    const schedules = scheduleSnap.docs.map(d => d.data());
    allSchedules.push({ sensorId, schedules });
  }

  return allSchedules;
};