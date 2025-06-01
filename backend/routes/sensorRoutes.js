import express from 'express';
import {
    sensor,
    togglePump,
    getDataById,
    putSensorId,
    getSensorId,
    saveSchedules,
    getSchedules,
    deleteSchedule,
    updateSchedule,
    setPumpMode,
    getPumpMode,

} from '../controllers/sensor.js'

const router = express.Router();

router.post('/sensor-pid', putSensorId);
router.get('/sensor-pid', getSensorId);
router.post('/sensor', sensor);
router.post('/togglePump', togglePump);
router.get('/sensor/:pid', getDataById);
router.post('/saveSchedules/:pid/schedules',saveSchedules);
router.get('/getSchedules/:pid',getSchedules);
router.delete('/deleteSchedule/:pid/:scheduleId',deleteSchedule);
router.put('/updateSchedule/:pid/:scheduleId',updateSchedule);
router.post('/setPumpMode',setPumpMode);
router.get('/getPumpMode/:pid',getPumpMode);

export default router; 