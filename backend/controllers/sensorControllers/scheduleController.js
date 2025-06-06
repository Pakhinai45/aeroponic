import { connection } from '../../db.js';

// บันทึกเวลาการทำงานของปั๊มน้ำ -------------------------------------------------------------------------------
export const saveSchedules = async (req, res) => {
  const { pid } = req.params;
  const { on_time, off_time, day } = req.body;

  try {
    const query = 'INSERT INTO pump_schedules(day, on_time, off_time, plant_beds_pid) VALUES(?,?,?,?)';
    connection.query(query, [day, on_time, off_time, pid], (err, result)=>{
      if (err) {
        console.error("Error insert Schedule:",err);
        res.status(500).json({error:"Error insert Schedule"});
        return;
      }

      res.status(200).json(result);
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }
}

// ดึงเวลาการทำงานของปั๊มน้ำจากฐานข้อมูล -------------------------------------------------------------------------------
export const getSchedules = async (req, res) => {
  const { pid } = req.params; 

  try {
    const query = 'SELECT * FROM pump_schedules WHERE plant_beds_pid = ?';
    connection.query(query, [pid], (err,result)=>{
      if (err) {
        console.error("Error GET Schedule:",err);
        res.status(500).json({error:"Error GET Schedule"});
        return;
      }
      res.status(200).json(result);
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }
};

// ลบเวลาการทำงานของปั๊มน้ำ -------------------------------------------------------------------------------
export const deleteSchedule = async (req, res) => {
  const { tid } = req.params; 

  try {
    const query = 'DELETE FROM pump_schedules WHERE tid = ?';
    connection.query(query, [tid] , (err)=>{
      if (err) {
        console.error("Error delete Schedule:",err);
        res.status(500).json({error:"Error delete Schedule"});
        return;
      }
      res.status(200).json({ message: "Schedule deleted successfully" });
    })

    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// เเก้ไขเวลาการทำงานของปั๊มน้ำ -------------------------------------------------------------------------------
export const updateSchedule = async (req, res) => {
  const { tid } = req.params;
  const { on_time, off_time, day } = req.body;

  try {
    const query = 'UPDATE pump_schedules SET day = ?, on_time = ?, off_time = ? WHERE tid = ?';
    connection.query(query, [day, on_time, off_time, tid], (err)=>{
      if (err) {
        console.error("Error Update Schedule:",err);
        res.status(500).json({error:"Error Update Schedule"});
        return;
      }
      res.status(200).json({ message: "Schedule updated successfully" });
    });
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
    const query = 'UPDATE plant_beds SET mode = ? WHERE pid = ?';
    connection.query(query, [mode,pid],(err)=>{
      if (err) {
        console.error("Error Update Mode:",err);
        res.status(500).json({error:"Error Update Mode"});
        return;
      }
      console.log(`Mode for ${pid} set to ${mode}`);
      res.json({ success: true });
    });
  } catch (error) {
    console.error('Error setting mode:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ดึงโหมดการทำงานของปั้มน้ำจากฐานข้อมูล -------------------------------------------------------------------------
export const getPumpMode = async (req, res) => {
  const { pid } = req.params; 

  try {
    const query = 'SELECT mode FROM plant_beds WHERE pid = ?';
    connection.query(query, [pid], (err,result)=>{
      if (err) {
        console.error("Error Get Mode:",err);
        res.status(500).json({error:"Error Get Mode"});
        return;
      }
      res.json(result);
    });
  } catch (error) {
    console.error("Error fetching pump mode from Firebase:", error);
    res.status(500).json({ error: "Failed to fetch mode" });
  }
};