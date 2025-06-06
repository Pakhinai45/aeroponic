import express from 'express';
import {
    sensor,
    togglePump,
    getDataById,
    putSensorId,
    getSensorId,
} from '../controllers/sensorControllers/sensorController.js';

import {
    saveSchedules,
    getSchedules,
    deleteSchedule,
    updateSchedule,
    getPumpMode,
    setPumpMode
} from '../controllers/sensorControllers/scheduleController.js';

const router = express.Router();

//sensor
router.post('/sensor', sensor);
router.post('/togglePump', togglePump);
router.get('/sensor/:pid', getDataById);
router.post('/sensor-pid', putSensorId);
router.get('/sensor-pid', getSensorId);

//schedules
router.post('/saveSchedule/:pid',saveSchedules);
router.get('/getSchedules/:pid',getSchedules);
router.delete('/deleteSchedule/:tid',deleteSchedule);
router.put('/updateSchedule/:tid',updateSchedule);
router.post('/setPumpMode',setPumpMode);
router.get('/getPumpMode/:pid',getPumpMode);

export default router;

