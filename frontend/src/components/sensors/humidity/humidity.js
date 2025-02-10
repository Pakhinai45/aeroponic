import React, { useState, useEffect } from "react";
// import ReactSpeedometer from "react-d3-speedometer";
import './humidity.css'
import axios from 'axios';

const Humidity = () => {
  const [sensorData, setSensorData] = useState(null); // สถานะสำหรับค่าความชื้น

  useEffect(() => {
    const fetchSensorData = () =>{
      axios.get('http://192.168.25.198:3300/data')
      .then(response => {
        // console.log(`Humidity = `,response.data.humidity)
        setSensorData(response.data);
      })
      .catch(error => {
        console.error("Error fetching sensor data:",error);
      });
    };

    fetchSensorData();

    const intervalId = setInterval(fetchSensorData,1000);

    return () => clearInterval(intervalId);
  }, []);


  return (
    <div>
      {sensorData ? (
        <div>
          <p style={{color:'red'}}>Humidity: {sensorData.humidity}%</p>
        </div>
      ) : (
        <p style={{color:"#1D3322"}}>Loading sensor data...</p>
      )}
    </div>
  );
};

export default Humidity;
