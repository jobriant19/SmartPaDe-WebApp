import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface IoTData {
  waterLevel: number;
  soilMoisture: number;
  temp: number;
  humidity: number;
  pumpA: boolean;
  pumpB: boolean;
}

interface IoTContextType {
  data: IoTData;
  setPumpA: (val: boolean) => void;
  setPumpB: (val: boolean) => void;
}

const IoTContext = createContext<IoTContextType | undefined>(undefined);

export const IoTProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const waterLevelRef = React.useRef(5.2);
  const soilMoistureRef = React.useRef(85);
  const tempRef = React.useRef(28.5);
  const humidityRef = React.useRef(80);
  const pumpARef = React.useRef(false);
  const pumpBRef = React.useRef(false);

  const [waterLevel, setWaterLevel] = useState(waterLevelRef.current);
  const [soilMoisture, setSoilMoisture] = useState(soilMoistureRef.current);
  const [temp, setTemp] = useState(tempRef.current);
  const [humidity, setHumidity] = useState(humidityRef.current);
  const [pumpA, setPumpAState] = useState(pumpARef.current);
  const [pumpB, setPumpBState] = useState(pumpBRef.current);

  const setPumpA = (val: boolean) => {
    pumpARef.current = val;
    setPumpAState(val);
  };

  const setPumpB = (val: boolean) => {
    pumpBRef.current = val;
    setPumpBState(val);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Pump A (Irrigation) Logic -> affects Water Level
      if (pumpARef.current) {
        waterLevelRef.current += Math.random() * 0.5 + 0.2; // Increase when pump is on
      } else {
        waterLevelRef.current -= Math.random() * 0.2 + 0.1; // Decrease naturally
      }
      waterLevelRef.current = Math.max(0, Math.min(15, Math.round(waterLevelRef.current * 10) / 10));

      // Pump B (Nutrient) Logic -> affects Soil Moisture
      if (pumpBRef.current) {
        soilMoistureRef.current += Math.random() * 3 + 1; // Increase when nutrient pump is on
      } else {
        soilMoistureRef.current -= Math.random() * 1.5 + 0.5; // Decrease naturally
      }
      soilMoistureRef.current = Math.max(0, Math.min(100, Math.round(soilMoistureRef.current)));

      // Environment
      tempRef.current += (Math.random() * 0.4 - 0.2);
      tempRef.current = Math.max(20, Math.min(40, Math.round(tempRef.current * 10) / 10));

      humidityRef.current += (Math.random() * 2 - 1);
      humidityRef.current = Math.max(40, Math.min(100, Math.round(humidityRef.current)));

      // Automate Pump A
      if (pumpARef.current && waterLevelRef.current >= 10) {
        setPumpA(false);
      } else if (!pumpARef.current && waterLevelRef.current <= 4) {
        setPumpA(true);
      }

      // Automate Pump B
      if (pumpBRef.current && soilMoistureRef.current >= 80) {
        setPumpB(false);
      } else if (!pumpBRef.current && soilMoistureRef.current <= 40) {
        setPumpB(true);
      }

      // Sync state
      setWaterLevel(waterLevelRef.current);
      setSoilMoisture(soilMoistureRef.current);
      setTemp(tempRef.current);
      setHumidity(humidityRef.current);

    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <IoTContext.Provider value={{
      data: { waterLevel, soilMoisture, temp, humidity, pumpA, pumpB },
      setPumpA,
      setPumpB
    }}>
      {children}
    </IoTContext.Provider>
  );
};

export const useIoT = () => {
  const context = useContext(IoTContext);
  if (context === undefined) {
    throw new Error('useIoT must be used within an IoTProvider');
  }
  return context;
};
