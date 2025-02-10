import React, { useState } from "react";
import "./styles.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../AuthContext.js";
import axios from "axios";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, IconButton, TextField, CircularProgress } from '@mui/material';
import { Close } from '@mui/icons-material';

function SignInForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { setUid } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // สถานะโหลด

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);  // เริ่มโหลด

    try {
      const response = await axios.post("http://localhost:3300/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        console.log("User data:", response.data);
        
        setUid(response.data.uid);
        localStorage.setItem("uid", response.data.uid);

        window.location.href = "/dashboard";
      }
    } catch (error) {
      toast.error("Email or password is incorrect.", { theme: "colored" });
    } finally {
      setIsLoading(false);  // หยุดโหลด
    }
  };

  const openForgotPassword = () => {
    setOpenDialog(true);
  };

  const closeForgotPassword = () => {
    setOpenDialog(false);
  };

  const handleForgotPassword = async () => {
    let email = formData.email;

    if (!email) {
      toast.error("Please enter your email address.", { theme: "colored" });
      return;
    }

    try {
      const response = await axios.post("http://localhost:3300/forgot-password", { email });
      if (response.status === 200) {
        toast.success("A link to change your password has been sent to your email.", { theme: "colored" });
        closeForgotPassword();
      } else {
        toast.error("Error: " + response.data.message, { theme: "colored" });
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการส่งคำขอ: " + error.message, { theme: "colored" });
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleSubmit}>
        <h1 className="texth1-InUp">Login</h1>
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        
        {/* ปรับปุ่มให้มี CircularProgress */}
        <button className="btn-InUp" disabled={isLoading}>
          {isLoading ? (
            <CircularProgress size={24} style={{ color: "#fff", marginRight: 8 }} />
          ) : (
            "Sign In"
          )}
        </button>
        
        <p onClick={openForgotPassword} className="forgot-password">
          Forgot your password?
        </p>
      </form>

      {/* Dialog สำหรับการลืมรหัสผ่าน */}
      <Dialog open={openDialog} onClose={closeForgotPassword} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm password reset</DialogTitle>
        <Box position="absolute" top={0} right={0}>
          <IconButton onClick={closeForgotPassword}>
            <Close />
          </IconButton>
        </Box>
        <DialogContent>
          <TextField
            label="Want send to email"
            fullWidth
            variant="outlined"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button class="button-cancel-email" variant="contained" onClick={closeForgotPassword}>
            Cancel
          </Button>
          <Button class="button-confirm-email" variant="contained" onClick={handleForgotPassword}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SignInForm;
