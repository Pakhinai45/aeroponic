import React, { useEffect, useState } from "react";
import style from "./pump_status.module.css";
import axios from 'axios';

const Pump_status = ({data}) => {

    const [isFlowData, setIsFlowData] = useState(null);

    useEffect(() => {
    if (!data?.pid) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://192.168.74.198:3300/sensor/${data.pid}`);
        setIsFlowData(res.data);
      } catch (error) {
        console.error('Error fetching isFlowing data:', error);
      }
    };

    fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [data?.pid]);
    
    const isFlowing = String(isFlowData?.isFlowing) === "1";

    return(
        <p className={style.title}>
            Pump Status: {isFlowing ? 'ON.' : 'OFF.'}
        </p>
    );
};

export default Pump_status;