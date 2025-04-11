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
  const approveRequest = async (id) =>{

    try {
      const response = await axios.post(`http://localhost:3300/api/users/approveAdmin/${id}`);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }

  }

  //ปฏิเสธคำขอ
  const refuseRequest = async (id) =>{
    try {
      const response = await axios.post(`http://localhost:3300/api/users/refuseAdmin/${id}`);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
  }

  // ฟังก์ชันยกเลิกคำขอ โดยรับ id ของคำขอ
  const cancelRequest = async (id) => {
    try {
      console.log(`Canceling request with id:`, id);
      const response = await axios.delete(`http://localhost:3300/api/users/cancelAdminRequest/${id}`);
      alert(response.data.message);
      setRequests((prevRequests) => prevRequests.filter(request => request.id !== id));

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
        {/* <div className="navbar">
          <Navbar />
        </div> */}
        <h1 style={{ color: "red", textAlign: "center" }}>Admin Requests</h1>
        <div className="requests-container">
          {requests.length > 0 ? (
            requests.map((request) => (
              <div key={request.id} className="request-item">
                <p className="settextAR">Name: {request.name}</p>
                <p className="settextAR">Phone: {request.phon}</p>
                <p className="settextAR">Status: {request.statusRequest === 0 
                    ? 'Pending' 
                    : request.statusRequest === 1 
                    ? 'Refused' 
                    : 'Approved'}</p>

                {request.statusRequest === 0 &&(
                  <>
                   <button className="btn-ar" onClick={()=> approveRequest(request.id)}>approve</button>
                   <button className="btn-ar" onClick={()=> refuseRequest(request.id)}>refuse</button>
                   <button className="btn-ar" onClick={() => cancelRequest(request.id)}>delete</button>
                  </>
                )}

                {request.statusRequest === 1 &&(
                  <button className="btn-ar" onClick={()=> approveRequest(request.id)}>approve</button>
                )}

                {request.statusRequest === 2 &&(
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
