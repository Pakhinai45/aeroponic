import React from "react";
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './page/dashboard/dashboard';
import HistoricalData from './page/HistoricalData/historicalData';
import AdminRequest from './page/AdminRequest/adminRequest';
import ManageAdmin from './page/ManageAdmin/manageAdmin';
import SignInAndSignUp from './page/SignInAndSignUp/SignInAndSignUp.js';
import UserAdmin from "./page/UserAdmin/userAdmin.js";
import Profile from "./page/Profile/profile.js";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
      <Router>
        <ToastContainer position="top-center" autoClose={3000} />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path='/historical' element={<HistoricalData/>}></Route>
          <Route path='/adminrequest' element={<AdminRequest/>}></Route>
          <Route path='/manageadmin' element={<ManageAdmin/>}></Route>
          <Route path='/useradmin' element={<UserAdmin/>}></Route>
          <Route path='/profile' element={<Profile/>}></Route>
          <Route path='/' element={<SignInAndSignUp/>}></Route>
        </Routes>
      </Router>
  );
}

export default App;
