'use client';

import React, { useEffect } from 'react';
import type { ExtendedForecast } from '@/app/models/forecast';
import type { WeatherDetail } from '@/app/models/weather'; // Or your processed model for today's weather
import { ForecastGraph } from './ForecastGraph';
import { CurrentWeatherView } from './CurrentWeatherView';
import { useWeather } from '../context/weatherContext';
import { getTodaysDate } from '../utils/weatherUtils';
import DailyForecastTiles from './DailyForecastTiles';

interface WeatherDashboardProps {
  extendedForecast: ExtendedForecast | null;
  todaysForecast: WeatherDetail | null;
}

const WeatherDashboard: React.FC<WeatherDashboardProps> = ({
  extendedForecast,
  todaysForecast,
}) => {
  const { currentDisplay, setCurrentDisplay, setSelectedDay } = useWeather();

  console.log(todaysForecast);
  useEffect(() => {
    if (todaysForecast) {
      setCurrentDisplay(todaysForecast);
    }
    setSelectedDay(getTodaysDate());
  }, [todaysForecast, setCurrentDisplay, setSelectedDay]);

  return (
    <div>
      {currentDisplay && <CurrentWeatherView data={currentDisplay} />}
      {extendedForecast && <ForecastGraph forecast={extendedForecast} />}
      {extendedForecast && <DailyForecastTiles forecast={extendedForecast} />}
    </div>
  );
};

export default WeatherDashboard;
