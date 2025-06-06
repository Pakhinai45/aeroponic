import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./userAdmin.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function UserAdmin() {
  const [note , setNote] = useState("");
  const [requestStatus, setRequestStatus] = useState(null);
  const location = useLocation();

  const data = location.state?.userData;
  const uid = data.uid;

  // ฟังก์ชันสำหรับตรวจสอบคำขอที่ส่งไปแล้ว
  useEffect(() => {
    if(!uid) return;
    checkRequestStatus(uid);
    const intervalId = setInterval(() => {
      checkRequestStatus(uid);
    }, 3000);

    return () => clearInterval(intervalId);

  }, [uid]);

  
  // ฟังก์ชันสำหรับตรวจสอบสถานะคำขอ
  const checkRequestStatus = async (uid) => {
    try {
      const response = await axios.get(
        `http://localhost:3300/api/checkReqStatus/${uid}`
      );
      console.log('API Response:', response.data);
      if (response.data.length > 0) {
        const reqData = response.data[0] || {};
        setRequestStatus(reqData.req_status);
      } else {
        setRequestStatus(null); 
      }
    } catch (err) {
      console.error("Error checking request status:", err);
    }
  };

  // ฟังก์ชันในการส่งคำขอ admin ไปยัง API
  const handleRequestAdmin = async () => {
    const response = await axios.get(`http://localhost:3300/api/getUser/${uid}`);
    const userData = response.data[0] || {};
    console.log("DataUser:",userData);
    
    const requestData = {
      note:note,
      user_name: userData.user_name,
      phone: userData.phone,
      uid: uid,
    };

    try {
      const response = await axios.post(
        "http://localhost:3300/api/reqAdmin",
        requestData
      );
      if(response.status === 400){
        alert(response.data.message);
      }
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
        `http://localhost:3300/api/cancelReq/${uid}`
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
        <div className="detel-useradmin">
          <h1>Submit a request to become an administrator</h1>
          {requestStatus === null ? (
            <>
              <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                noValidate
                autoComplete="off"
              >
                <TextField 
                  id="outlined-basic" 
                  label="Outlined" 
                  value={note}
                  onChange={(e) => setNote(e.target.value)} />
              </Box>

              <button onClick={handleRequestAdmin}>
                ส่งคำขอ
              </button>
            </>
          ) : requestStatus === "0" ? (
            <div>
              <p>ส่งคำขอแล้ว รอตรวจสอบการอนุมัติ</p>
              <button onClick={cancelRequest}>ยกเลิกคำขอ</button>
            </div>
          ) : requestStatus === "1" ? (
            <p>คำขอถูกปฏิเสธ</p>
          ) : requestStatus === "2" ? (
            <p>คำขอถูกอนุมัติเเล้ว ตอนนี้คุณคือผู้ดูเเลระบบ</p>
          ) : null}
        </div>
      </div>
    </div>
  );
  
}

export default UserAdmin;
