import { useEffect, useState, useCallback } from "react";
import style from "./pump_auto.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PumpAuto = ({ data, onClose }) => {
  // console.log("pid:",data?.pid);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    on_time: "",
    off_time: "",
    day: "Monday",
  });

  const [schedules, setSchedules] = useState([]);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchSchedules = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3300/getSchedules/${data.pid}`);
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  }, [data.pid]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // เปิดฟอร์มเพิ่มใหม่
  const openAddForm = () => {
    setEditingScheduleId(null);
    setFormData({
      on_time: "",
      off_time: "",
      day: "Monday",
    });
    setShowForm(true);
  };

  // เปิดฟอร์มแก้ไขโดยเอาข้อมูลเดิมมาแสดง
  const openEditForm = (schedule) => {
    setEditingScheduleId(schedule.tid);
    setFormData({
      on_time: schedule.on_time,
      off_time: schedule.off_time,
      day: schedule.day,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { on_time, off_time, day } = formData;

    try {
      if (editingScheduleId) {
       
        // แก้ไข
        await axios.put(
          `http://localhost:3300/updateSchedule/${editingScheduleId}`,
          { on_time, off_time, day }
        );
        toast.success(`Edit Successfuly`);
      } else {
        // เพิ่มใหม่
        await axios.post(`http://localhost:3300/saveSchedule/${data.pid}`, {
          on_time,
          off_time,
          day,
        });
        toast.success(`Ste Time Successfuly`);
      }

      await fetchSchedules();
      setShowForm(false);
      setEditingScheduleId(null);
    } catch (error) {
      console.error("Error saving schedule:", error);
    }
  };

  // ฟังก์ชันลบ
  const handleDelete = async (tid) => {
    // console.log("scheduleId:",tid);
    
    if (!window.confirm("ต้องการลบเวลานี้จริงหรือไม่?")) return;

    try {
      await axios.delete(`http://localhost:3300/deleteSchedule/${tid}`);
      toast.success(`Delete Successfuly`);
      await fetchSchedules();
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  return (
    <div className={style.autoContainer}>
      <button className={style.closeButton} onClick={onClose}>
        Close
      </button>
      <div className={style.list}>
        <div className={style.card} onClick={openAddForm}>
          <p className="add-icon">➕</p>
          <p>Set Time</p>
        </div>
        {schedules.length > 0 ? (
          schedules.map((schedule) => (
            <div key={schedule.tid} className={style.card} style={{ position: "relative" }}>
              <p>{schedule.day}</p>
              <p>ON : {schedule.on_time}</p>
              <p>OFF : {schedule.off_time}</p>

              <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === schedule.tid ? null : schedule.tid)
                  }
                  style={{
                    background: "none",
                    color:"white",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                >
                  ⋮
                </button>

                {openMenuId === schedule.tid && (
                  <div
                    style={{
                      position: "absolute",
                      top: "25px",
                      right: "0",
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                      zIndex: 10,
                    }}
                  >
                    <button
                      onClick={() => {
                        openEditForm(schedule);
                        setOpenMenuId(null);
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "8px",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(schedule.tid);
                        setOpenMenuId(null);
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "8px",
                        border: "none",
                        background: "none",
                        color: "red",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>

      {showForm && (
        <div className={style.formOverlay}>
          <form className={style.formContainer} onSubmit={handleSubmit}>
            <h3>{editingScheduleId ? "แก้ไขเวลาปั๊มน้ำ" : "ตั้งเวลาเปิด-ปิดปั๊มน้ำ"}</h3>

            <label>วัน:</label>
            <select name="day" value={formData.day} onChange={handleChange}>
              <option value="Monday">จันทร์</option>
              <option value="Tuesday">อังคาร</option>
              <option value="Wednesday">พุธ</option>
              <option value="Thursday">พฤหัสบดี</option>
              <option value="Friday">ศุกร์</option>
              <option value="Saturday">เสาร์</option>
              <option value="Sunday">อาทิตย์</option>
            </select>

            <label>เวลาเปิด:</label>
            <input
              type="time"
              name="on_time"
              value={formData.on_time}
              onChange={handleChange}
              required
            />

            <label>เวลาปิด:</label>
            <input
              type="time"
              name="off_time"
              value={formData.off_time}
              onChange={handleChange}
              required
            />

            <div className={style.buttonGroup}>
              <button type="submit">{editingScheduleId ? "บันทึกการแก้ไข" : "บันทึก"}</button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingScheduleId(null);
                }}
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PumpAuto;
