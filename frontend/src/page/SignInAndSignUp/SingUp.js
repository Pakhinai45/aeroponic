import React, { useState } from "react";
import "./styles.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';

function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    phon: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [openDialog, setOpenDialog] = useState(false);
  

  const openConfirmSingup = () => {
    setOpenDialog(true);
  };

  const closeConfirmSingup = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่ามีช่องใดว่างหรือไม่
    for (const field in formData) {
      if (!formData[field]) {
        toast.warn(`กรุณากรอกข้อมูลในช่อง ${field === 'name' ? 'Name' : field === 'phon' ? 'Phone' : field === 'email' ? 'Email' : field === 'password' ? 'Password' : 'Confirm Password'}`, { theme: "colored" });
        return; // หากพบช่องว่างให้หยุดและแสดงข้อความเตือน
      }
    }

    // ตรวจสอบเบอร์โทรว่าเป็น 10 หลักหรือไม่
    if (formData.phon.length !== 10) {
      toast.warn("กรุณากรอกเบอร์โทรให้ครบ 10 หลัก", { theme: "colored" });
      return;
    }

    // ตรวจสอบว่า password และ confirmPassword ตรงกันหรือไม่
    if (formData.password !== formData.confirmPassword) {
      toast.warn("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน", { theme: "colored" });
      return;
    }

    // เปิด Dialog แสดงข้อมูลก่อนที่จะยืนยันการสมัคร
    openConfirmSingup();
  };

  const handleConfirm = async () => {
    // ส่งข้อมูลไปยังเซิร์ฟเวอร์หลังจากยืนยัน
    try {
      const response = await axios.post("http://localhost:3300/api/users/signUp", formData);
      console.log("Response:", response.data);

      if (response.status === 200) {
        toast.success(response.data.message || "🎉 สมัครบัญชีสำเร็จ!", { theme: "colored" });
        setFormData({ name: "", phon: "", email: "", password: "", confirmPassword: "" });
        closeConfirmSingup();
      } else {
        toast.error("❌ " + (response.data.message || "เกิดข้อผิดพลาด"));
      }
    } catch (error) {
      toast.error("❌This email has already been used.");
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form>
        <h1 className="texth1-InUp">Create Account</h1>
        <div className="social-container">
        </div>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="text"
          name="phon"
          value={formData.phon}
          onChange={handleChange}
          placeholder="Phone"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
        />
        <button className="btn-InUp" onClick={handleSubmit}>Sign Up</button>
      </form>

      {/* Dialog for confirmation */}
      <Dialog open={openDialog} onClose={closeConfirmSingup} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm your details</DialogTitle>
        <Box position="absolute" top={0} right={0}>
          <IconButton onClick={closeConfirmSingup}>
            <Close />
          </IconButton>
        </Box>
        <DialogContent>
          <Typography>Name: {formData.name}</Typography>
          <Typography>Phone: {formData.phon}</Typography>
          <Typography>Email: {formData.email}</Typography>
        </DialogContent>
        <DialogActions>
          <Button class="button-cancel-email"  variant="contained" onClick={closeConfirmSingup}>
            Cancel
          </Button>
          <Button class="button-confirm-email" variant="contained" onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SignUpForm;
