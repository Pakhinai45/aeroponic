import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./manageAdmin.css";

function ManageAdmin() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // เพิ่มการกรองข้อมูล
  const [selectedUser, setSelectedUser] = useState(null); // เก็บข้อมูลผู้ใช้ที่ต้องการแก้ไข
  const [modalEditUser, setModalEditUser] = useState(false); 
  const [modalCreateUser, setmodalCreateUser] = useState(false); 

  // ดึงข้อมูลผู้ใช้ทั้งหมด
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3300/api/users/getUser");
      if (response.data.success) {
        setUsers(response.data.users);
        
        setFilteredUsers(response.data.users); 
      } else {
        console.error("Error fetching users:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ฟังก์ชันสำหรับกรองข้อมูลตาม status
  const filterUsersByStatus = (user_status) => {
    if (user_status === null) {
      setFilteredUsers(users); 
    } else {
      setFilteredUsers(users.filter((user) => user.user_status === user_status)); 
    }
  };

  // ฟังก์ชันสำหรับเปิด modal เพื่อแก้ไขข้อมูลผู้ใช้
  const openEditModal = (user) => {
    setSelectedUser(user); 
    setModalEditUser(true); 
  };

  // ฟังก์ชันสำหรับปิด modal
  const closeEditModal = () => {
    setModalEditUser(false);
    setSelectedUser(null);
  };

  // ปิด modal สำหรับสร้างบัญชี
  const closeAddModal = () => {
    setmodalCreateUser(false);
    setSelectedUser(null);
  };

  // ฟังก์ชันสำหรับอัพเดตข้อมูลผู้ใช้
  const handleSaveChanges = async () => {
    if (!selectedUser.uid) {
      console.log('uid',selectedUser.uid);
      toast.error("UID is missing");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3300/api/users/updateUser/${selectedUser.uid}`,
        selectedUser 
      );
      toast.success(response.data.message);

      fetchUsers();

      closeEditModal(); 
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // ฟังก์ชันสำหรับลบข้อมูลผู้ใช้
  const deleteUser = async (uid) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    console.log(`uidDelete:`,uid);
    
    try {
      const response = await axios.delete(
        `http://localhost:3300/api/users/deleteUser/${uid}`
      );
      toast.success(response.data.message);

      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // ฟังก์ชันสำหรับเปิด modal เพื่อเพิ่มบัญชีใหม่
  const openAddModal = () => {
    setSelectedUser({
      user_name: "",
      email: "",
      phone: "",
      password: "", 
      user_status: 0,
    });
    setmodalCreateUser(true);
  };

  // ฟังก์เพิ่มบัญชีใหม่
  const handleCreateUser = async () => {
    const { user_name, email, password, phone, user_status } = selectedUser;

    if (!user_name || !email || !phone || !password ) {
      toast.warn("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3300/api/users/signUpByRoot", {
        user_name: user_name,
        phone: phone,
        email: email,
        password: password, 
        user_status: user_status,
      });

      toast.success(response.data.message);

      fetchUsers();

      closeAddModal();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(error.response?.data?.message || "Failed to create user.");
    }
  };

  return (
    <div className="grid-manageAdmin">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="content-manageAdmin">
        
        <div className="manage-admin">
          <h1>Manage Users</h1>

          {/* ปุ่มกรอง */}
          <div className="filter-buttons">
            <button onClick={() => filterUsersByStatus(null)}>All Users</button>
            <button onClick={() => filterUsersByStatus(0)}>General</button>
            <button onClick={() => filterUsersByStatus(1)}>Admin</button>
          </div>

          <div className="users-list">
            <div
              className="user-card add-user-card"
              onClick={() => openAddModal()}
            >
              <p className="add-icon">➕</p>
              <p>Add New User</p>
            </div>

            {filteredUsers.length === 0 ? (
              <p className="no-users">No users available</p>
            ) : (
              filteredUsers.map((user, index) => (
                <div key={index} className="user-card">
                  {/* ไอคอนปากกา */}
                  <button
                    className="edit-icon"
                    onClick={() => openEditModal(user)}
                  >
                    ✏️
                  </button>
                  <button
                    className="edit-icon"
                    onClick={() => deleteUser(user.uid)}
                  >
                    🗑️
                  </button>
                  <p>
                    <strong>Name:</strong> {user.user_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {user.phone}
                  </p>
                  <p>
                    <strong>Status:</strong> {user.user_status === 1 ? "Admin" : "General"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal สำหรับแก้ไขข้อมูล */}
      {modalEditUser && !modalCreateUser && selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit User Information</h2>
            <label>Name</label>
            <input
              type="text"
              value={selectedUser.user_name}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, user_name: e.target.value })
              }
            />
            <label>Email</label>
            <input
              type="text"
              value={selectedUser.email}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
            />
            <label>Phone:</label>
            <input
              type="text"
              value={selectedUser.phone}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, phone: e.target.value })
              }
            />
            <label style={{marginRight:10}}>Status</label>
            <select
              value={selectedUser.user_status}
              onChange={(e) => {
                setSelectedUser({
                  ...selectedUser,
                  user_status: Number(e.target.value), 
                });
              }}
            >
              <option value={0}>General</option>
              <option value={1}>Admin</option>
            </select>

            <div className="modal-actions">
              <button onClick={handleSaveChanges}>Save Changes</button>
              <button onClick={closeEditModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal สร้างบัญชี */}
      {modalCreateUser && !modalEditUser && selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New User</h2>
            <label>Name</label>
            <input
              type="text"
              value={selectedUser.user_name}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, user_name: e.target.value })
              }
            />
            <label>Email</label>
            <input
              type="text"
              value={selectedUser.email}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
            />
            <label>Password</label>
            <input
              type="password"
              value={selectedUser.password}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, password: e.target.value })
              }
            />
            <label>Phone:</label>
            <input
              type="text"
              value={selectedUser.phone}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, phone: e.target.value })
              }
            />
            <label style={{marginRight:10}}>Status</label>
            <select
              value={selectedUser.user_status}
              onChange={(e) => {
                setSelectedUser({
                  ...selectedUser,
                  user_status: Number(e.target.value),
                });
              }}
            >
              <option value={0}>General</option>
              <option value={1}>Admin</option>
            </select>
            
            <div className="modal-actions">
              <button onClick={handleCreateUser}>Create User</button>
              <button onClick={closeAddModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ManageAdmin;
