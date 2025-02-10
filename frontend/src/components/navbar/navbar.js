import React from "react";
import "./navbar.css";  // นำเข้า CSS


function Navbar() {
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/dashboard" className="navbar-brand">My React App</a>
        <ul className="navbar-links">
          <li className="navbar-item">
            {/* <a href="/" className="navbar-link" >Home</a> */}
          </li>
          <li className="navbar-item">
            {/* <a href="/about" className="navbar-link">About</a> */}
          </li>
          <li className="navbar-item">
            {/* <a href="/contact" className="navbar-link">Contact</a> */}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
