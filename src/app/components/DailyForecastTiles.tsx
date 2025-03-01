'use client';

import React, { useEffect, useState } from 'react';
import { useWeather } from '../context/weatherContext';
import type { DailyForecast, ExtendedForecast } from '@/app/models/forecast';
import DailyForecastTile from './DailyForecastTile';
import {
  convertKelvinToCelsius,
  convertKelvinToFahrenheit,
  createIconImageURL,
} from '../utils/weatherUtils';
import { TempUnit } from '../models/weather';
import { convertUnixToWeekday } from '../utils/controllerUtils';

interface DailyForecastTilesProps {
  forecast: ExtendedForecast;
}

interface DailyForecastTiles {
  day: string;
  minTemp: number;
  maxTemp: number;
  icon: string;
  onClick: () => void;
}

interface TileData {
  high: number;
  low: number;
  dt: number;
  date: string;
  day: string;
  description: string;
  icon: string;
}

interface DailyForecastTiles {
  highestTemperature: number;
}

const convertTemperaturesToSelectedUnit = (
  high: number,
  low: number,
  tempUnit: TempUnit,
): { high: number; low: number } => {
  return {
    high:
      tempUnit === 'C'
        ? convertKelvinToCelsius(high)
        : convertKelvinToFahrenheit(high),
    low:
      tempUnit === 'C'
        ? convertKelvinToCelsius(low)
        : convertKelvinToFahrenheit(low),
  };
};

const createTileData = (
  dailyForecastData: DailyForecast,
  temperatureUnit: TempUnit,
  date: string,
): TileData => {
  const { high, low } = convertTemperaturesToSelectedUnit(
    dailyForecastData.highestTemperature,
    dailyForecastData.lowestTemperature,
    temperatureUnit,
  );
  return {
    high,
    low,
    date,
    day: convertUnixToWeekday(dailyForecastData.timeOfHighestTemperature),
    description: dailyForecastData.mostCommonWeather.main,
    dt: dailyForecastData.timeOfHighestTemperature,
    icon: createIconImageURL(dailyForecastData.mostCommonWeather.icon),
  };
};

const findWeatherDetailFromDate = (
  forecast: ExtendedForecast,
  tile: TileData,
) => {
  console.log('clicked tile', tile);
  console.log(
    forecast,
    'ftf',
    forecast[tile.date],
    'ftffffe3',
    forecast[tile.date]['weatherDetail'],
    'ftffff',
    forecast[tile.date]['weatherDetail'][tile.dt],
  );
  return forecast[tile.date]['weatherDetail'][tile.dt];
};

const DailyForecastTiles: React.FC<DailyForecastTilesProps> = ({
  forecast,
}) => {
  const { selectedDay, setSelectedDay, setCurrentDisplay, temperatureUnit } =
    useWeather();

  const [tileData, setTileData] = useState<TileData[]>([]);

  useEffect(() => {
    const tiles = Object.entries(forecast).map(([date, dailyForecast]) =>
      createTileData(dailyForecast, temperatureUnit, date),
    );
    setTileData(tiles);
  }, [forecast, temperatureUnit, selectedDay]);

  const handleTileClick = (tile: TileData) => {
    console.log('Tile clicked:', tile);
    const weatherDetail = findWeatherDetailFromDate(forecast, tile);
    console.log('wd, ', weatherDetail);
    setCurrentDisplay(weatherDetail);
    setSelectedDay(tile.date);
  };

  return (
    <div className="flex justify-center space-x-8">
      {tileData.map((tile, index) => (
        <div key={index} onClick={() => handleTileClick(tile)}>
          <DailyForecastTile
            day={tile.day}
            minTemp={tile.low}
            maxTemp={tile.high}
            icon={tile.icon}
            isActive={tile.date === selectedDay}
            onClick={() => handleTileClick(tile)}
          />
        </div>
      ))}
    </div>
  );
};

export default DailyForecastTiles;
