'use client';

import { WeatherDetail } from '../models/weather';
import { getFormattedTemperature } from '../utils/weatherUtils';
import { useWeather } from '../context/weatherContext';
import Image from 'next/image';

interface CurrentWeatherViewProps {
  data: WeatherDetail;
  name: string;
}

export const CurrentWeatherView: React.FC<CurrentWeatherViewProps> = ({
  data,
  name,
}) => {
  const { temperatureUnit, setTemperatureUnit } = useWeather();

  const {
    pressure,
    humidity,
    windSpeedKmh,
    weatherMetadata,
    formattedTime,
    rain,
  } = data;

  const { formattedTemp, formattedFeelsLikeTemp } = getFormattedTemperature(
    data,
    temperatureUnit,
  );

  return (
    <div>
      <div className="mb-4 text-xl font-bold">Results for {name}</div>
      <div className="flex flex-row items-center border border-gray-300 rounded p-4 space-x-4">
        <div className="flex-shrink-0">
          <Image
            src={weatherMetadata?.icon}
            alt={weatherMetadata?.description}
            className="h-24 w-24"
            width={24}
            height={24}
          />
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex flex-row">
            <div className="text-6xl font-bold">{formattedTemp}&deg;</div>
            <div className="flex h-1/3 space-x-2 mt-2">
              <button
                onClick={() => setTemperatureUnit('C')}
                className={`px-2 py-1 border rounded ${
                  temperatureUnit === 'C' ? 'font-bold bg-blue-200' : ''
                }`}
              >
                C
              </button>
              <button
                onClick={() => setTemperatureUnit('F')}
                className={`px-2 py-1 border rounded ${
                  temperatureUnit === 'F' ? 'font-bold bg-blue-200' : ''
                }`}
              >
                F
              </button>
            </div>
          </div>
          <div className="text-xs font-bold">
            <span>Feels Like: </span>
            {formattedFeelsLikeTemp}
          </div>
        </div>
        <div className="flex flex-col justify-center">
          {rain !== undefined ? (
            <p className="text-sm">Rain: {rain} mm</p>
          ) : (
            <>
              <p className="text-sm">Pressure: {pressure} hPa</p>
              <p className="text-sm">Humidity: {humidity}%</p>
              <p className="text-sm">Wind: {windSpeedKmh} km/h</p>
            </>
          )}
        </div>
        <div className="flex flex-col items-end flex-grow">
          <h1 className="text-4xl font-bold">{weatherMetadata?.main}</h1>
          <h2 className="text-2xl">{formattedTime}</h2>
          <h3 className="text-xl capitalize">{weatherMetadata?.description}</h3>
        </div>
      </div>
    </div>
  );
};
