import React, { useState } from "react";
import style from "./signInAndSignUp.module.css";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../AuthContext.js";
import axios from "axios";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, IconButton, TextField, CircularProgress } from '@mui/material';
import { Close } from '@mui/icons-material';
import classNames from "classnames";

function SignInForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { setUid } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);  

    try {
      const response = await axios.post("http://localhost:3300/api/users/login", {
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
      setIsLoading(false);  
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
      const response = await axios.post("http://localhost:3300/api/users/forgotPassword", { email });
      if (response.status === 200) {
        toast.success("A link to change your password has been sent to your email.", { theme: "colored" });
        closeForgotPassword();
      } else {
        toast.error("Error: " + response.data.message, { theme: "colored" });
      }
    } catch (error) {
      toast.error("There was an error sending the request.: " + error.message, { theme: "colored" });
    }
  };

  return (
    <div className={classNames(style.formContainer,style.signInContainer)}>
      <form onSubmit={handleSubmit}>
        <h1 className={style.texth1InUp}>Login</h1>
        <TextField
          type="email"
          label="Email"
          name="email"
          fullWidth
          variant="outlined"
          sx={{mb:2}}
          onChange={handleChange}
        />
        <TextField
          type="password"
          name="password"
          label="Password"
          fullWidth
          variant="outlined"
          sx={{mb:2}}
          onChange={handleChange}
        />
        
        {/*CircularProgress */}
        <button className={style.btnInUp} disabled={isLoading}>
          {isLoading ? (
            <CircularProgress size={24} style={{ color: "#fff", marginRight: 8 }} />
          ) : (
            "Sign In"
          )}
        </button>
        
        <p onClick={openForgotPassword} className={style.forgotPassword}>
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
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={closeForgotPassword}
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
            onClick={handleForgotPassword}
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

export default SignInForm;
