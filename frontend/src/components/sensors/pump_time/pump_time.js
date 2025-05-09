import React, { useEffect, useState } from 'react';
import axios from 'axios';
import style from './pump_time.module.css'

import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ManageHistoryRoundedIcon from '@mui/icons-material/ManageHistoryRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

const TimerSwitch = ({data}) => {
  const [openMinutes, setOpenMinutes] = useState(0);
  const [openSeconds, setOpenSeconds] = useState(0);
  const [closeMinutes, setCloseMinutes] = useState(0);
  const [closeSeconds, setCloseSeconds] = useState(0);

  const [openDuration, setOpenDuration] = useState(openMinutes * 60 + openSeconds);
  const [closeDuration, setCloseDuration] = useState(closeMinutes * 60 + closeSeconds);

  const [openCountdown, setOpenCountdown] = useState(openDuration);
  const [closeCountdown, setCloseCountdown] = useState(closeDuration);

  const [isOn, setIsOn] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [showSetTimeForm, setShowSetTimeForm] = useState(false); 

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      if (isOn) {
        setOpenCountdown(prev => {
          if (prev <= 1) {
            setIsOn(false);
            return openDuration;
          }
          return prev - 1;
        });
      } else {
        setCloseCountdown(prev => {
          if (prev <= 1) {
            setIsOn(true);
            return closeDuration;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, isOn, openDuration, closeDuration]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const toggleTimer = () => setIsRunning(prev => !prev);

  const handleSetTime = () => {
    const newOpen = Number(openMinutes) * 60 + Number(openSeconds);
    const newClose = Number(closeMinutes) * 60 + Number(closeSeconds);
    setOpenDuration(newOpen);
    setCloseDuration(newClose);
    setOpenCountdown(newOpen);
    setCloseCountdown(newClose);
    setIsRunning(false);
    setIsOn(true);
    setShowSetTimeForm(false); 
  };

  return (
    <div className={style.container}>
      <h1 className={`${style.timeText} ${isOn ? style.on : ''}`}>
        ON {formatTime(openCountdown)} s
      </h1>
      <h1 className={`${style.timeText} ${!isOn ? style.off : ''}`}>
        OFF {formatTime(closeCountdown)} s
      </h1>

      <button onClick={toggleTimer} className={style.button}>
        {isRunning ? (<><PauseRoundedIcon/> Stop</>):(<><PlayArrowRoundedIcon/> Start</>)}
      </button>

      <button onClick={() => setShowSetTimeForm(true)} className={style.button}>
        <ManageHistoryRoundedIcon/>Setting
      </button>

      {showSetTimeForm && (
        <div className={style.modalOverlay}>
          <div className={style.modal}>
            <h2 className={style.modalTitle}>SETTING TIME</h2>

            <div className={style.inputRow}>
              <label>ON : </label>
              <input type="number" min="0" value={openMinutes} onChange={(e) => setOpenMinutes(e.target.value)} /> minute
              <input type="number" min="0" value={openSeconds} onChange={(e) => setOpenSeconds(e.target.value)} /> second
            </div>

            <div className={style.inputRow}>
              <label>OFF : </label>
              <input type="number" min="0" value={closeMinutes} onChange={(e) => setCloseMinutes(e.target.value)} /> minute
              <input type="number" min="0" value={closeSeconds} onChange={(e) => setCloseSeconds(e.target.value)} /> second
            </div>

            <button onClick={handleSetTime} className={style.button2}><CheckRoundedIcon/>OK</button>
            <button onClick={() => setShowSetTimeForm(false)} className={style.button2}><CloseRoundedIcon/>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerSwitch;
