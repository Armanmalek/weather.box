'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TempUnit, WeatherDetail } from '../models/weather';
import { ExtendedForecast } from '../models/forecast';
import { getTodaysDate } from '../utils/weatherUtils';
import { useWeather } from '../context/weatherContext';
import { CategoricalChartFunc } from 'recharts/types/chart/generateCategoricalChart';

export type GraphTab = 'precipitation' | 'wind' | 'temperature';

interface ForecastGraphProps {
  forecast: ExtendedForecast;
}

interface DataPoint {
  timestamp: string;
  name: string;
  precipitation: number;
  wind: number;
  temperature: number;
  weatherDetail: WeatherDetail;
  forecastDate: string;
}

export const createDataPoint = (
  weatherDetail: WeatherDetail,
  temperatureUnit: TempUnit,
  forecastDate: string,
): DataPoint => {
  return {
    name: weatherDetail.formattedTime,
    precipitation: weatherDetail.rain ?? 0,
    wind: weatherDetail.windSpeedKmh,
    temperature:
      weatherDetail.temperature[
        temperatureUnit === 'C' ? 'celsius' : 'fahrenheit'
      ],
    timestamp: weatherDetail.formattedTime,
    forecastDate,
    weatherDetail, // keeping this to set the selcted temperature when you click a data point
  };
};

export const getForecastData = (
  forecast: ExtendedForecast,
  selectedDay: string,
  temperatureUnit: TempUnit,
) => {
  const dataPoints: DataPoint[] = [];
  if (selectedDay === getTodaysDate()) {
    for (const [forecastDate, forecastDateValue] of Object.entries(forecast)) {
      for (const weatherDetail of Object.values(
        forecastDateValue['weatherDetail'],
      )) {
        if (dataPoints.length < 8) {
          dataPoints.push(
            createDataPoint(weatherDetail, temperatureUnit, forecastDate),
          );
        } else {
          break;
        }
      }
    }
  } else {
    const forecastOfDate = forecast[selectedDay];
    for (const weatherDetail of Object.values(
      forecastOfDate['weatherDetail'],
    )) {
      dataPoints.push(
        createDataPoint(weatherDetail, temperatureUnit, selectedDay),
      );
    }
  }
  return dataPoints;
};

export const ForecastGraph: React.FC<ForecastGraphProps> = ({ forecast }) => {
  const { temperatureUnit, selectedDay, setSelectedDay, setCurrentDisplay } =
    useWeather();

  const [selectedTab, setSelectedTab] = useState<GraphTab>('temperature');
  const [chartData, setChartData] = useState<DataPoint[]>(
    getForecastData(forecast, selectedDay, temperatureUnit),
  );

  useEffect(() => {
    setChartData(() => getForecastData(forecast, selectedDay, temperatureUnit));
  }, [selectedDay, temperatureUnit, forecast, selectedTab]);

  const handleDotClick: CategoricalChartFunc = (event) => {
    if (event?.activePayload) {
      setCurrentDisplay(event.activePayload[0].payload.weatherDetail);
      setSelectedDay(event.activePayload[0].payload.forecastDate);
    }
  };

  return (
    <div>
      <div className="flex space-x-4 mb-2">
        <button
          onClick={() => setSelectedTab('temperature')}
          className={`px-4 py-2 border rounded ${
            selectedTab === 'temperature' ? 'font-bold bg-blue-200' : ''
          }`}
        >
          Temparature
        </button>
        <button
          onClick={() => setSelectedTab('precipitation')}
          className={`px-4 py-2 border rounded ${
            selectedTab === 'precipitation' ? 'font-bold bg-blue-200' : ''
          }`}
        >
          Precipitation
        </button>
        <button
          onClick={() => setSelectedTab('wind')}
          className={`px-4 py-2 border rounded ${
            selectedTab === 'wind' ? 'font-bold bg-blue-200' : ''
          }`}
        >
          Wind
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} onClick={handleDotClick}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          {selectedTab === 'temperature' && (
            <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
          )}
          {selectedTab === 'precipitation' && (
            <Line type="monotone" dataKey="precipitation" stroke="#8884d8" />
          )}
          {selectedTab === 'wind' && (
            <Line type="monotone" dataKey="wind" stroke="#82ca9d" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
