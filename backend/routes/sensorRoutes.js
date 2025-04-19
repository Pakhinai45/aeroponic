import express from 'express';
import {
    sensor,
    togglePump,
    getDataById,
    putSensorId,
    getSensorId,

} from '../controllers/sensor.js'

const router = express.Router();

router.post('/sensor-id', putSensorId);
router.get('/sensor-id', getSensorId);
router.post('/sensor', sensor);
router.post('/togglePump', togglePump);
router.get('/sensor/:id', getDataById);

export default router; 