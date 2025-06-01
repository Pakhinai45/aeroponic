import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import { useUser } from "../../UserContext";
import { useAuth } from "../../AuthContext";
import "./profile.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Profile() {
  const { userData } = useUser();
  const { uid } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(userData); // เก็บข้อมูลที่สามารถแก้ไขได้

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
    
    if (!/^0\d{9}$/.test(profile.phone)) {
        toast.warn("Please enter a valid 10-digit", { theme: "colored" });
        return;
      }

    try {
      const response = await axios.put(`http://localhost:3300/api/users/updateUser/${uid}`, profile);

      if (response.data.success) {
        toast.success(`Data edit successfully.`,{theme:"colored"});
        setIsEditing(false);
      } else {
        toast.error(`Unable to edit data! ${response.data.message} `,{theme:"colored"})
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(`Unable to edit data! ${error} `,{theme:"colored"})
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
                <label>Name:</label>
                <input type="text" name="user_name" value={profile.user_name} onChange={handleChange} />

                <label>E-Mail:</label>
                <input type="email" name="email" value={profile.email} onChange={handleChange} />

                <label>Phone:</label>
                <input type="text" name="phone" value={profile.phone} onChange={handleChange} />

                {/* ปุ่มบันทึก */}
                <button className="save-btn" onClick={handleSave}>บันทึก</button>
              </div>
            ) : (
              <div className="profile-info">
                <h2>{profile.user_name}</h2>
                <p><strong>E-Mail:</strong> {profile.email}</p>
                <p><strong>Phone:</strong> {profile.phone}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
