import React, { useEffect, useState, useCallback } from "react";
import style from "./pump_auto.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PumpAuto = ({ data, onClose }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    onTime: "",
    offTime: "",
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
      setSchedules(response.data.schedules);
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
      onTime: "",
      offTime: "",
      day: "Monday",
    });
    setShowForm(true);
  };

  // เปิดฟอร์มแก้ไขโดยเอาข้อมูลเดิมมาแสดง
  const openEditForm = (schedule) => {
    setEditingScheduleId(schedule.id);
    setFormData({
      onTime: schedule.onTime,
      offTime: schedule.offTime,
      day: schedule.day,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { onTime, offTime, day } = formData;

    try {
      if (editingScheduleId) {
        // แก้ไข
        await axios.put(
          `http://localhost:3300/updateSchedule/${data.pid}/${editingScheduleId}`,
          { onTime, offTime, day }
        );
        toast.success(`Edit Successfuly`);
      } else {
        // เพิ่มใหม่
        await axios.post(`http://localhost:3300/saveSchedules/${data.pid}/schedules`, {
          onTime,
          offTime,
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
  const handleDelete = async (scheduleId) => {
    if (!window.confirm("ต้องการลบเวลานี้จริงหรือไม่?")) return;

    try {
      await axios.delete(`http://localhost:3300/deleteSchedule/${data.pid}/${scheduleId}`);
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
            <div key={schedule.id} className={style.card} style={{ position: "relative" }}>
              <p>{schedule.day}</p>
              <p>ON : {schedule.onTime}</p>
              <p>OFF : {schedule.offTime}</p>

              <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === schedule.id ? null : schedule.id)
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

                {openMenuId === schedule.id && (
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
                        handleDelete(schedule.id);
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
              name="onTime"
              value={formData.onTime}
              onChange={handleChange}
              required
            />

            <label>เวลาปิด:</label>
            <input
              type="time"
              name="offTime"
              value={formData.offTime}
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
