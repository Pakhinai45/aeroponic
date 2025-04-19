import React, { useState } from "react";
import { Link } from "react-router-dom";  // ใช้ React Router สำหรับการเปลี่ยนหน้า
import "./Sidebar.css";  
import { useUser } from "../../UserContext";

function Sidebar() {
  
  const {userData} = useUser();
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token"); // ลบ token
    window.location.href = "/"; // กลับไปหน้าแรก
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Arrowponic</h2>
      </div>
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <Link to="/dashboard" className="sidebar-link">Dashboard</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/historical" className="sidebar-link">Historical Data</Link>
        </li>

        {/* แสดงเมนูเฉพาะที่เหมาะสม */}
        {userData?.status === 0 && (
          <li className="sidebar-item">
            <Link to="/useradmin" className="sidebar-link">Admin</Link>
          </li>
        )}

        {userData?.status === 1 && (
          <li className="sidebar-item">
            <Link to="/useradmin" className="sidebar-link">Admin</Link>
          </li>
        )}

        {userData?.status === 2 && (
          <>
            <li className="sidebar-item">
              <Link to="/adminrequest" className="sidebar-link">Admin Request</Link>
            </li>
            <li className="sidebar-item">
              <Link to="/manageadmin" className="sidebar-link">Manage Admin</Link>
            </li>
          </>
        )}

        <li className="sidebar-item">
          <Link to="/profile" className="sidebar-link">Profile</Link>
        </li>

        <li className="sidebar-item" onClick={() => setShowLogoutModal(true)}>
          <Link className="sidebar-link">SignOut</Link>
        </li>
      </ul>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>ต้องการออกจากระบบใช่ไหม?</p>
            <button onClick={handleLogout} className="confirm-btn">ตกลง</button>
            <button onClick={() => setShowLogoutModal(false)} className="cancel-btn">ยกเลิก</button>
          </div>
        </div>
      )}


    </div>
  );
}

export default Sidebar;
