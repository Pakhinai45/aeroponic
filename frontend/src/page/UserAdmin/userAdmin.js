import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./userAdmin.css";
import { useUser } from "../../UserContext";
import { useAuth } from "../../AuthContext";
import axios from "axios";

function UserAdmin() {
  const { uid } = useAuth();
  const { userData } = useUser();
  const [requestStatus, setRequestStatus] = useState(null);

  // ฟังก์ชันสำหรับตรวจสอบคำขอที่ส่งไปแล้ว
  useEffect(() => {
    const intervalId = setInterval(() => {
      checkRequestStatus(uid);
    }, 3000);

    
    return () => clearInterval(intervalId);
  }, [uid]);

  
  // ฟังก์ชันสำหรับตรวจสอบสถานะคำขอ
  const checkRequestStatus = async (uid) => {
    try {
      const response = await axios.get(
        `http://localhost:3300/check-admin-request/${uid}`
      );
      console.log('API Response:', response.data);
      if (response.data.exists) {
        // console.log('statusRequest:', response.data.statusRequest);
        setRequestStatus(response.data.statusRequest);
      } else {
        setRequestStatus(null); 
      }
    } catch (err) {
      console.error("Error checking request status:", err);
    }
  };

  // ฟังก์ชันในการส่งคำขอ admin ไปยัง API
  const handleRequestAdmin = async () => {

    const requestData = {
      name: userData.name,
      phon: userData.phon,
      uid: uid,
    };

    try {
      const response = await axios.post(
        "http://localhost:3300/request-admin",
        requestData
      );
      alert(response.data.message);
      checkRequestStatus(uid); 
    } catch (err) {
      console.error("Error sending request:", err);
    } 
  };


  // ฟังก์ชันยกเลิกคำขอ
  const cancelRequest = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3300/cancel-admin-request/${uid}`
      );
      alert(response.data.message);
      checkRequestStatus(uid); 
    } catch (err) {
      console.error("Error canceling request:", err);
    }
  };

  return (
    <div className="grid-useradmin">
      <div className="sidebar-contrinner">
        <Sidebar />
      </div>
      <div className="content-useradmin">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="detel-useradmin">
          <h1>Submit a request to become an administrator</h1>
          
          {requestStatus === null ? (
            <button onClick={handleRequestAdmin}>
              ส่งคำขอ
            </button>
          ) : requestStatus === 0 ? (
            <div>
              <p>ส่งคำขอแล้ว ขอตรวจสอบการอนุมัติ</p> 
              <button onClick={cancelRequest}>ยกเลิกคำขอ</button>
            </div>
          ) : requestStatus === 1 ? (
            <p>คำขอถูกปฏิเสธ</p> 
          ) : requestStatus === 2 ? (
            <p>คำขอถูกอนุมัติเเล้ว ตอนนี้คุณคือผู้ดูเเลระบบ</p>
          ) :null}
        </div>
      </div>
    </div>
  );
  
}

export default UserAdmin;
