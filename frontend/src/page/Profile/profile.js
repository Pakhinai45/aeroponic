import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import "./profile.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const location = useLocation();

  const data = location.state?.userData;
  const uid = data?.uid;

  // เปิด/ปิดโหมดแก้ไข
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // จัดการการเปลี่ยนแปลงข้อมูล
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!uid) return;
    const getUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3300/api/getUserData/${uid}`
        );
        console.log("data:", response.data[0]);
        setProfile(response.data[0]);
      } catch (error) {
        console.error("Error getUserData:", error);
        toast.error(`Error getUserData! ${error} `, { theme: "colored" });
      }
    };
    getUserData();
  }, [uid]);

  // ฟังก์ชันบันทึกข้อมูลไปยัง API
  const handleSave = async () => {
    if (!/^0\d{9}$/.test(profile.phone)) {
      toast.warn("Please enter a valid 10-digit", { theme: "colored" });
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3300/api/updateUser/${uid}`,
        profile
      );

      if (response.data.success) {
        toast.success(`Edit successfully.`, { theme: "colored" });
        setIsEditing(false);
      } else {
        toast.error(`Unable to edit data! ${response.data.message} `, {
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(`Unable to edit data! ${error} `, { theme: "colored" });
    }
  };

  if (!profile) {
    return (
      <div className="grid-profile">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="content-profile">
          <div className="profile-container">
            <div className="profile-card">
              <p>กำลังโหลดข้อมูล...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <input
                  type="text"
                  name="user_name"
                  value={profile.user_name}
                  onChange={handleChange}
                />

                <label>E-Mail:</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                />

                <label>Phone:</label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                />

                {/* ปุ่มบันทึก */}
                <button className="save-btn" onClick={handleSave}>
                  บันทึก
                </button>
              </div>
            ) : (
              <div className="profile-info">
                <h2>{profile.user_name}</h2>
                <p>
                  <strong>E-Mail:</strong> {profile.email}
                </p>
                <p>
                  <strong>Phone:</strong> {profile.phone}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
