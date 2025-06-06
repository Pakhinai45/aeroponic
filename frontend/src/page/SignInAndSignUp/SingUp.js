import { useState } from "react";
import style from "./signInAndSignUp.module.css";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, IconButton, Typography, TextField } from '@mui/material';
import { Close } from '@mui/icons-material';
import classNames from "classnames";

function SignUpForm() {
  const [formData, setFormData] = useState({
    user_name: "",
    phone: "",
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

    // ตรวจสอบว่ามีช่องว่างหรือไม่
    for (const field in formData) {
      if (!formData[field]) {
        toast.warn(`Please fill in the ${ field === 'user_name' ? 'Name' : field === 'phone' ? 'Phone' : 
                                          field === 'email' ? 'Email' : field === 'password' ? 'Password' : 'Confirm Password'} field.`, { theme: "colored" });
        return;
      }
    }

    // ตรวจสอบเบอร์โทร
    if (!/^0\d{9}$/.test(formData.phone)) {
      toast.warn("Please enter a valid 10-digit", { theme: "colored" });
      return;
    }


    // ตรวจสอบว่า password และ confirmPassword ตรงกันหรือไม่
    if (formData.password !== formData.confirmPassword) {
      toast.warn("Password and Confirm Password do not match.", { theme: "colored" });
      return;
    }

    // เปิด Dialog แสดงข้อมูลก่อนที่จะยืนยันการสมัคร
    openConfirmSingup();
  };

  const handleConfirm = async () => {
    // ส่งข้อมูลไปยังเซิร์ฟเวอร์หลังจากยืนยัน
    try {
      const response = await axios.post("http://localhost:3300/api/signUp", formData);
      console.log("Response:", response.data);

      if (response.status === 200) {
        toast.success("Insert Data Successfuly" , { theme: "colored" });
        setFormData({ user_name: "", phone: "", email: "", password: "", confirmPassword: "" });
        closeConfirmSingup();
      } else {
        toast.error("❌" + (response.data.message || "Error"));
      }
    } catch (error) {
      toast.error("This email has already been used.");
    }
  };

  return (
    <div className={classNames(style.formContainer , style.signUpContainer)}>
      <form>
        <h1 className={style.texth1InUp}>Create Account</h1>
        <TextField
          type="text"
          name="user_name"
          fullWidth
          value={formData.user_name}
          onChange={handleChange}
          label="Name"
          sx={{
            '& .MuiOutlinedInput-root': {
              height: 40, 
            },
            '& .MuiInputLabel-root': {
              top: '-5px', 
            },
              mb:2,
          }}
        />

        <TextField
          type="text"
          name="phone"
          fullWidth
          value={formData.phone}
          onChange={handleChange}
          label="Phone"
          sx={{
            '& .MuiOutlinedInput-root': {
              height: 40, 
            },
            '& .MuiInputLabel-root': {
              top: '-5px', 
            },
              mb:2,
          }}
        />
        <TextField
          type="email"
          name="email"
          fullWidth
          value={formData.email}
          onChange={handleChange}
          label="Email"
          sx={{
            '& .MuiOutlinedInput-root': {
              height: 40, 
            },
            '& .MuiInputLabel-root': {
              top: '-5px', 
            },
              mb:2,
          }}
        />
        <TextField
          type="password"
          name="password"
          fullWidth
          value={formData.password}
          onChange={handleChange}
          label="Password"
          sx={{
            '& .MuiOutlinedInput-root': {
              height: 40, 
            },
            '& .MuiInputLabel-root': {
              top: '-5px', 
            },
              mb:2,
          }}
        />
        <TextField
          type="password"
          name="confirmPassword"
          fullWidth
          value={formData.confirmPassword}
          onChange={handleChange}
          label="Confirm Password"
          sx={{
            '& .MuiOutlinedInput-root': {
              height: 40, 
            },
            '& .MuiInputLabel-root': {
              top: '-5px', 
            },
              mb:1,
          }}
        />
        <button className={style.btnInUp} onClick={handleSubmit}>Sign Up</button>
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
          <Typography>Name: {formData.user_name}</Typography>
          <Typography>Phone: {formData.phone}</Typography>
          <Typography>Email: {formData.email}</Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            variant="contained" 
            onClick={closeConfirmSingup}
            sx={{
              backgroundColor: '#830000',
              color: 'white',
              borderRadius: '20px',
              padding: '10px 20px',
              fontSize: '14px',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#b41515'
              }
            }}
          >
            Cancel
          </Button>

          <Button 
            variant="contained" 
            onClick={handleConfirm}
            sx={{
              backgroundColor: '#1D3322',
              color: 'white',
              borderRadius: '20px',
              padding: '10px 20px',
              fontSize: '14px',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#0d9719'
              }
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SignUpForm;
