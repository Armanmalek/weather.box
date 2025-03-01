'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TempUnit, WeatherDetail } from '../models/weather';

interface WeatherContextType {
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  currentDisplay: WeatherDetail | null;
  setCurrentDisplay: (data: WeatherDetail | null) => void;
  temperatureUnit: TempUnit;
  setTemperatureUnit: (unit: TempUnit) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize selected day to today's date (in YYYY-MM-DD format)
  const [selectedDay, setSelectedDay] = useState<string>(
    new Date().toISOString().split('T')[0],
  );
  const [currentDisplay, setCurrentDisplay] = useState<WeatherDetail | null>(
    null,
  );

  const [temperatureUnit, setTemperatureUnit] = useState<TempUnit>('C');

  console.log('when i initialize its', selectedDay);
  return (
    <WeatherContext.Provider
      value={{
        selectedDay,
        setSelectedDay,
        currentDisplay,
        setCurrentDisplay,
        temperatureUnit,
        setTemperatureUnit,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
