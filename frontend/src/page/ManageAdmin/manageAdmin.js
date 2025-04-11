import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import axios from "axios";
import "./manageAdmin.css";

function ManageAdmin() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // เพิ่มการกรองข้อมูล
  const [selectedUser, setSelectedUser] = useState(null); // เก็บข้อมูลผู้ใช้ที่ต้องการแก้ไข
  const [modalVisible, setModalVisible] = useState(false); // สถานะการแสดง modal
  const [modalCreateUser, setmodalCreateUser] = useState(false); // สถานะการแสดง modal

  // ฟังก์ชันดึงข้อมูลผู้ใช้ทั้งหมด
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3300/api/users/getUser");
      if (response.data.success) {
        setUsers(response.data.users);
        setFilteredUsers(response.data.users); // ตั้งค่าเริ่มต้นให้แสดงทุกผู้ใช้
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
  const filterUsersByStatus = (status) => {
    if (status === null) {
      setFilteredUsers(users); // หากไม่มีการเลือกกรอง ให้แสดงข้อมูลทั้งหมด
    } else {
      setFilteredUsers(users.filter((user) => user.status === status)); // กรองตาม status
    }
  };

  // ฟังก์ชันสำหรับเปิด modal เพื่อแก้ไขข้อมูลผู้ใช้
  const openEditModal = (user) => {
    setSelectedUser(user); // เก็บข้อมูลผู้ใช้ที่เลือกเพื่อแก้ไข
    setModalVisible(true); // เปิด modal
  };

  // ฟังก์ชันสำหรับปิด modal
  const closeEditModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  // ปิด modal สำหรับสร้างบัญชี
  const closeAddModal = () => {
    setmodalCreateUser(false);
    setSelectedUser(null);
  };

  // ฟังก์ชันสำหรับอัพเดตข้อมูลผู้ใช้
  const handleSaveChanges = async () => {
    if (!selectedUser || !selectedUser.id) {
      alert("User ID is missing");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3300/api/users/updateUser/${selectedUser.id}`, // ใช้ id จาก selectedUser ใน URL
        selectedUser // ส่งข้อมูลที่ถูกแก้ไขไป
      );
      alert(response.data.message);

      // รีเฟรชข้อมูลทั้งหมดจากเซิร์ฟเวอร์
      fetchUsers();

      closeEditModal(); // ปิด modal
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await axios.delete(
        `http://localhost:3300/api/users/deleteUser/${userId}`
      );
      alert(response.data.message);

      // รีเฟรชข้อมูลผู้ใช้หลังจากลบ
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // ฟังก์ชันสำหรับเปิด modal เพื่อเพิ่มบัญชีใหม่
  const openAddModal = () => {
    setSelectedUser({
      name: "",
      email: "",
      phon: "",
      password: "", // เพิ่มฟิลด์ password
      status: 0, // ค่าเริ่มต้นเป็นบัญชีทั่วไป
      tokenline: "",
    });
    setmodalCreateUser(true);
  };

  const handleCreateUser = async () => {
    const { name, email, password, phon, status, tokenline } = selectedUser;

    if (!name || !email || !phon || !password ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3300/api/users/signUpByRoot", {
        name: name,
        phon: phon,
        email: email,
        password: password, 
        status: status,
        tokenline: tokenline,
      });

      alert(response.data.message);

      // รีเฟรชข้อมูลทั้งหมดจากเซิร์ฟเวอร์
      fetchUsers();

      closeAddModal();
    } catch (error) {
      console.error("Error creating user:", error);
      alert(error.response?.data?.message || "Failed to create user.");
    }
  };

  return (
    <div className="grid-manageAdmin">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="content-manageAdmin">
        {/* <div className="navbar">
          <Navbar />
        </div> */}

        <div className="manage-admin">
          <h1>Manage Users</h1>

          {/* ปุ่มกรอง */}
          <div className="filter-buttons">
            <button onClick={() => filterUsersByStatus(null)}>All Users</button>
            <button onClick={() => filterUsersByStatus(0)}>General</button>
            <button onClick={() => filterUsersByStatus(1)}>Admin</button>
            <button onClick={() => filterUsersByStatus(2)}>Root Admin</button>
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
                    onClick={() => deleteUser(user.id)}
                  >
                    🗑️
                  </button>
                  <p>
                    <strong>Name:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {user.phon}
                  </p>
                  <p>
                    <strong>Status:</strong> {user.status}
                  </p>
                  <p>
                    <strong>TokenLine:</strong> {user.tokenline}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal สำหรับแก้ไขข้อมูล */}
      {modalVisible && !modalCreateUser && selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit User Information</h2>
            <label>Name</label>
            <input
              type="text"
              value={selectedUser.name}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, name: e.target.value })
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
              value={selectedUser.phon}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, phon: e.target.value })
              }
            />
            <label>Status</label>
            <input
              type="number"
              value={selectedUser.status}
              onChange={(e) => {
                const newValue = Math.min(
                  Math.max(Number(e.target.value), 0),
                  2
                );
                setSelectedUser({ ...selectedUser, status: newValue });
              }}
            />
            <label>TokenLine</label>
            <input
              type="text"
              value={selectedUser.tokenline}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, tokenline: e.target.value })
              }
            />

            <div className="modal-actions">
              <button onClick={handleSaveChanges}>Save Changes</button>
              <button onClick={closeEditModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal สร้างบัญชี */}
      {modalCreateUser && !modalVisible && selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New User</h2> {/* เปลี่ยนข้อความให้ชัดเจน */}
            <label>Name</label>
            <input
              type="text"
              value={selectedUser.name}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, name: e.target.value })
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
              value={selectedUser.phon}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, phon: e.target.value })
              }
            />
            <label>Status</label>
            <input
              type="number"
              value={selectedUser.status}
              onChange={(e) => {
                const newValue = Math.min(
                  Math.max(Number(e.target.value), 0),
                  2
                );
                setSelectedUser({ ...selectedUser, status: newValue });
              }}
            />
            <label>TokenLine</label>
            <input
              type="text"
              value={selectedUser.tokenline}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, tokenline: e.target.value })
              }
            />

            <div className="modal-actions">
              <button onClick={handleCreateUser}>Create User</button> {/* ปรับข้อความปุ่ม */}
              <button onClick={closeAddModal}>Cancel</button> {/* ปิด modal สร้าง */}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ManageAdmin;
