import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import { useUser } from "../../UserContext";
import { useAuth } from "../../AuthContext";
import "./profile.css";

function Profile() {
  const { userData } = useUser(); // ดึงข้อมูลจาก Context
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(userData); // เก็บข้อมูลที่สามารถแก้ไขได้
  const { uid } = useAuth();

  console.log(`data:`, userData);
  console.log(`id:`, uid);

  // เปิด/ปิดโหมดแก้ไข
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // จัดการการเปลี่ยนแปลงข้อมูล
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // ฟังก์ชันบันทึกข้อมูลไปยัง API
  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:3300/updateUser/${uid}`, profile);

      if (response.data.success) {
        alert("✅ บันทึกข้อมูลสำเร็จ!");
        setIsEditing(false);
      } else {
        alert("❌ บันทึกไม่สำเร็จ: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <div className="grid-profile">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="content-profile">
        <div className="profile-container">
          <div className="profile-card">
            {/* ปุ่มแก้ไข */}
            <button className="edit-btn" onClick={toggleEdit}>
              ✏️ แก้ไข
            </button>

            {/* ข้อมูลโปรไฟล์ */}
            {isEditing ? (
              <div className="profile-info">
                <label>ชื่อ:</label>
                <input type="text" name="name" value={profile.name} onChange={handleChange} />

                <label>E-Mail:</label>
                <input type="email" name="email" value={profile.email} onChange={handleChange} />

                <label>เบอร์โทร:</label>
                <input type="text" name="phon" value={profile.phon} onChange={handleChange} />

                <label>Token Line:</label>
                <input type="text" name="tokenline" value={profile.tokenline} onChange={handleChange} />

                {/* ปุ่มบันทึก */}
                <button className="save-btn" onClick={handleSave}>บันทึก</button>
              </div>
            ) : (
              <div className="profile-info">
                <h2>{profile.name}</h2>
                <p><strong>E-Mail:</strong> {profile.email}</p>
                <p><strong>เบอร์โทร:</strong> {profile.phon}</p>
                <p><strong>Token Line:</strong> {profile.tokenline || "ยังไม่มีข้อมูล"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
