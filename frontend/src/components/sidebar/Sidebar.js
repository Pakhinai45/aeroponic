import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import style from "./Sidebar.module.css";  
import { useUser } from "../../UserContext";
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

function Sidebar() {
  
  const {userData} = useUser();
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; 
  };

  return (
    <div className={style.sidebar}>
      <div className={style.sidebar_header}>
        <h2>Aeroponic</h2>
      </div>

      {/* เมนูหลัก */}
      <ul className={style.sidebar_menu}>
        <li className={style.sidebar_item}>
          <Link to="/dashboard" className={style.sidebar_link}><DashboardIcon/>Dashboard</Link>
        </li>
        <li className={style.sidebar_item}>
          <Link to="/historical" className={style.sidebar_link}><AssessmentIcon/>Historical Data</Link>
        </li>

        {userData?.user_status === 0 && (
          <li className={style.sidebar_item}>
            <Link to="/useradmin" className={style.sidebar_link}><DriveFileRenameOutlineIcon/>Admin</Link>
          </li>
        )}

        {userData?.user_status === 1 && (
          <li className={style.sidebar_item}>
            <Link to="/useradmin" className={style.sidebar_link}><DriveFileRenameOutlineIcon/>Admin</Link>
          </li>
        )}

        {userData?.user_status === 2 && (
          <>
            <li className={style.sidebar_item}>
              <Link to="/adminrequest" className={style.sidebar_link}><ContactMailIcon/>User Request</Link>
            </li>
            <li className={style.sidebar_item}>
              <Link to="/manageadmin" className={style.sidebar_link}><ManageAccountsIcon/>User Management</Link>
            </li>
          </>
        )}

        <li className={style.sidebar_item}>
          <Link to="/profile" className={style.sidebar_link}><AccountBoxIcon/>Profile</Link>
        </li>
      </ul>

      <div className={style.logout_container} onClick={() => setShowLogoutModal(true)}>
        <Link className={style.sidebar_link}><LogoutIcon/>SignOut</Link>
      </div>


      {/* Logout Modal */}
      {showLogoutModal && (
        <div className={style.modal_overlay}>
          <div className={style.modal_content}>
            <p>ต้องการออกจากระบบใช่ไหม?</p>
            <button onClick={handleLogout} className={style.confirm_btn}>ตกลง</button>
            <button onClick={() => setShowLogoutModal(false)} className={style.cancel_btn}>ยกเลิก</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
