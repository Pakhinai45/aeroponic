import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import "./adminRequest.css";


function AdminRequest() {
  const [requests, setRequests] = useState([]);
  
  // ฟังก์ชันดึงข้อมูลจาก API
  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:3300/api/users/adminRequestsAll");
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error.message);
    }
  };

  // เรียก API 
  useEffect(() => {
    fetchRequests(); 
    const interval = setInterval(fetchRequests, 3000); 

    return () => clearInterval(interval); 
  }, []);

  //อนุมัติคำขอ
  const approveRequest = async (uid) =>{

    try {
      const response = await axios.post(`http://localhost:3300/api/users/approveAdmin/${uid}`);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }

  }

  //ปฏิเสธคำขอ
  const refuseRequest = async (uid) =>{
    try {
      const response = await axios.post(`http://localhost:3300/api/users/refuseAdmin/${uid}`);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
  }

  // ฟังก์ชันยกเลิกคำขอ โดยรับ id ของคำขอ
  const cancelRequest = async (uid) => {
    try {
      console.log(`Canceling request with id:`, uid);
      const response = await axios.delete(`http://localhost:3300/api/users/cancelAdminRequest/${uid}`);
      alert(response.data.message);
      setRequests((prevRequests) => prevRequests.filter(request => request.uid !== uid));

    } catch (err) {
      console.error('Error canceling request:', err);
    }
  };

  return (
    <div className="grid-adminRequest">
      <div className="sidebar-contrinner">
        <Sidebar />
      </div>
      <div className="content-adminRequest">
        <h1 style={{ color: "red", textAlign: "center" }}>Admin Requests</h1>
        <div className="requests-container">
          {requests.length > 0 ? (
            requests.map((request) => (
              <div key={request.id} className="request-item">
                <p className="settextAR">Name: {request.user_name}</p>
                <p className="settextAR">Phone: {request.phone}</p>
                <p className="settextAR">Status: {request.req_status === 0 
                    ? 'Pending' 
                    : request.req_status === 1 
                    ? 'Refused' 
                    : 'Approved'}</p>

                {request.req_status === 0 &&(
                  <>
                    <button className="btn-ar" onClick={()=> approveRequest(request.id)}>approve</button>
                    <button className="btn-ar" onClick={()=> refuseRequest(request.id)}>refuse</button>
                    <button className="btn-ar" onClick={() => cancelRequest(request.id)}>delete</button>
                  </>
                )}

                {request.req_status === 1 &&(
                  <>
                    <button className="btn-ar" onClick={()=> approveRequest(request.id)}>approve</button>
                    <button className="btn-ar" onClick={() => cancelRequest(request.id)}>delete</button>
                  </>
                )}

                {request.req_status === 2 &&(
                  <button className="btn-ar" onClick={()=> refuseRequest(request.id)}>refuse</button>
                )}

              </div>
            ))
          ) : (
            <p>No requests found</p> // แสดงข้อความเมื่อไม่มีข้อมูล
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminRequest;
