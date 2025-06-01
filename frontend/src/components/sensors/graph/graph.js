import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const RealtimeGraph = ({ data }) => {
  const [graphData, setGraphData] = useState([]);
  const [visibleLines, setVisibleLines] = useState({
    distance: true,
    humidity: true,
    temperature: true,
    ldr: true,
    pH: true,
  });

  const lineColors = {
    distance: '#8884d8',
    humidity: '#82ca9d',
    temperature: '#ff7300',
    ldr: '#00c49f',
    pH: '#ff6666',
  };

  const sensorRanges = {
    distance: [0, 100],
    humidity: [0, 100],
    temperature: [0, 100],
    ldr: [0, 4095],
    pH: [0, 30],
  };

  // โหลดข้อมูลจาก localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('realtimeGraphData');
    if (savedData) {
      setGraphData(JSON.parse(savedData));
    }
  }, []);

  // เพิ่มข้อมูลใหม่
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (data) {
        const newData = {
          ...data,
          time: new Date().toISOString(),
        };
        setGraphData((prevData) => {
          const updatedData = [...prevData, newData].slice(-50);
          localStorage.setItem('realtimeGraphData', JSON.stringify(updatedData));
          return updatedData;
        });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [data]);

  const handleToggleLine = (key) => {
    setVisibleLines((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // คำนวณ domain ตามเซ็นเซอร์ที่เปิดอยู่
  const getYAxisDomain = () => {
    const activeKeys = Object.keys(visibleLines).filter((key) => visibleLines[key]);
    if (activeKeys.length === 1) {
      return sensorRanges[activeKeys[0]] || [0, 100];
    } else {
      // ถ้าเปิดหลายตัว ใช้ [0, max range] เพื่อไม่ให้ค่าตัดกัน
      let min = 0;
      let max = Math.max(...activeKeys.map((key) => sensorRanges[key]?.[1] || 100));
      return [min, max];
    }
  };

  return (
    <div>
      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '10px',
          flexWrap: 'wrap',
        }}
      >
        {Object.keys(lineColors).map((key) => (
          <span
            key={key}
            onClick={() => handleToggleLine(key)}
            style={{
              cursor: 'pointer',
              color: visibleLines[key] ? lineColors[key] : '#ccc',
              textDecoration: visibleLines[key] ? 'none' : 'line-through',
              fontWeight: 'bold',
              position: 'relative',
              top: '5px',
              left: '250px',
            }}
          >
            {key.toUpperCase()}
          </span>
        ))}
      </div>

      {/* Graph */}
      <div style={{ width: '850px', height: '320px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={graphData} margin={{ right: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickFormatter={(time) =>
                new Date(time).toLocaleTimeString('th-TH', { hour12: false })
              }
              minTickGap={20}
            />
            <YAxis domain={getYAxisDomain()} />
            <Tooltip
              labelFormatter={(label) =>
                new Date(label).toLocaleString('th-TH', { hour12: false })
              }
            />
            {Object.keys(visibleLines).map(
              (key) =>
                visibleLines[key] && (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={lineColors[key]}
                    dot={false}
                  />
                )
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RealtimeGraph;
