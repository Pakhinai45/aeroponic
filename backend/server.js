import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';


import userRoutes from './routes/userRoutes.js';
import sensorRoutes from './routes/sensorRoutes.js';
// import './schedulers/autoScheduler.js';

dotenv.config();

// กำหนดตัวแปรที่จำเป็น
const app = express();
const PORT = 3300;
app.use(cors());
app.use(bodyParser.json());

app.use(sensorRoutes);
app.use(userRoutes);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
