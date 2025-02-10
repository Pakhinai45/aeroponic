import * as React from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';

// import Navbar from "../../components/navbar/navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./dashboard.css";

import Humidity from "../../components/sensors/humidity/humidity";
import Light from "../../components/sensors/light/light";
import PH from "../../components/sensors/ph/ph";
import Temperature from "../../components/sensors/temper/temper";
import ControSwitch from "../../components/sensors/contro_switch/contro_switch";
import WaterLevel from "../../components/sensors/water/water";


const CustomGrid = ({ size, height, children, rowGap }) => (
  <Grid
    size={size}
    height={height}
    rowGap={rowGap}
    sx={{ border: '2px solid #70807F', borderRadius: '8px' }}
    backgroundColor="#FFFFFF"
  >
    {children}
  </Grid>
);

function Dashboard() {
  return (
    <div className="grid-dashboard">
      <div className="sidebar-contrinner">
        <Sidebar />
      </div>
      <div className="content-dashboard">
        {/* <div className="navbar">
          <Navbar />
        </div> */}
        <Box sx={{ flexGrow: 2 }}>
          <Grid container spacing={1}>
            <CustomGrid size={4} height={200}>
              <WaterLevel></WaterLevel>
            </CustomGrid>

            <CustomGrid size={2} height={200}>
              <Humidity></Humidity>
            </CustomGrid>

            <CustomGrid size={2} height={200}>
              <Temperature></Temperature>
            </CustomGrid>

            <CustomGrid size={2} height={200}>
              <Light></Light>
            </CustomGrid>

            <CustomGrid size={2} height={200}>
              <PH></PH>
            </CustomGrid>

            <CustomGrid size={10} height={350}>
            </CustomGrid>

            <CustomGrid size={2} height={200}>
              <ControSwitch></ControSwitch>
            </CustomGrid>

          </Grid>
        </Box>
      </div>
    </div>
  );
}

export default Dashboard;
