// 'use client';

// import React, { useState } from 'react';
// import {
//   convertKelvinToCelsius,
//   convertKelvinToFahrenheit,
//   convertMsToKmh,
// } from '../utils/conversionUtils';

// export type TempUnit = 'C' | 'F';

// export interface WeatherData {
//   coord: { lon: number; lat: number };
//   weather: { id: number; main: string; description: string; icon: string }[];
//   base: string;
//   main: {
//     temp: number;
//     feels_like: number;
//     temp_min: number;
//     temp_max: number;
//     pressure: number;
//     humidity: number;
//     sea_level?: number;
//     grnd_level?: number;
//   };
//   visibility: number;
//   wind: { speed: number; deg: number };
//   clouds: { all: number };
//   dt: number;
//   sys: {
//     type: number;
//     id: number;
//     country: string;
//     sunrise: number;
//     sunset: number;
//   };
//   timezone: number;
//   id: number;
//   name: string;
//   cod: number;
//   rain?: { '1h'?: number; '3h'?: number };
// }

// interface CurrentWeatherViewProps {
//   data: WeatherData;
// }

// export const CurrentWeatherView: React.FC<CurrentWeatherViewProps> = ({
//   data,
// }) => {
//   const [unit, setUnit] = useState<TempUnit>('C');

//   const temperature =
//     unit === 'C'
//       ? convertKelvinToCelsius(data.main.temp)
//       : convertKelvinToFahrenheit(data.main.temp);

//   const formattedTemp = temperature.toFixed(1);

//   // Additional values
//   const pressure = data.main.pressure; // in hPa
//   const humidity = data.main.humidity; // as a percentage
//   const windSpeedKmh = convertMsToKmh(data.wind.speed).toFixed(1);

//   // Convert Unix timestamp to a readable time string
//   const time = new Date(data.dt * 1000).toLocaleTimeString([], {
//     hour: '2-digit',
//     minute: '2-digit',
//   });

//   // Weather icon URL (provided by OpenWeatherMap)
//   const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

//   return (
//     <div className="flex flex-row items-center border border-gray-300 rounded p-4 space-x-4">
//       <div className="flex-shrink-0">
//         <img
//           src={iconUrl}
//           alt={data.weather[0].description}
//           className="h-24 w-24"
//         />
//       </div>

//       <div className="flex flex-col justify-center">
//         <div className="text-6xl font-bold">{formattedTemp}&deg;</div>
//         <div className="flex space-x-2 mt-2">
//           <button
//             onClick={() => setUnit('C')}
//             className={`px-2 py-1 border rounded ${
//               unit === 'C' ? 'font-bold bg-blue-200' : ''
//             }`}
//           >
//             C
//           </button>
//           <button
//             onClick={() => setUnit('F')}
//             className={`px-2 py-1 border rounded ${
//               unit === 'F' ? 'font-bold bg-blue-200' : ''
//             }`}
//           >
//             F
//           </button>
//         </div>
//       </div>

//       {/* Column 3: Additional Details */}
//       <div className="flex flex-col justify-center">
//         {data.rain && (data.rain['1h'] || data.rain['3h']) ? (
//           <p className="text-sm">
//             Rain: {data.rain['1h'] ?? data.rain['3h']} mm
//           </p>
//         ) : (
//           <p className="text-sm">Pressure: {pressure} hPa</p>
//         )}
//         <p className="text-sm">Humidity: {humidity}%</p>
//         <p className="text-sm">Wind: {windSpeedKmh} km/h</p>
//       </div>

//       {/* Column 4: Weather Summary */}
//       <div className="flex flex-col items-end flex-grow">
//         <h1 className="text-4xl font-bold">{data.weather[0].main}</h1>
//         <h2 className="text-2xl">{time}</h2>
//         <h3 className="text-xl capitalize">{data.weather[0].description}</h3>
//       </div>
//     </div>
//   );
// };

// src/components/CurrentWeatherView.tsx
'use client';

import { WeatherDetail } from '../models/weather';
import { getFormattedTemperature } from '../utils/weatherUtils';
import { useWeather } from '../context/weatherContext';

interface CurrentWeatherViewProps {
  data: WeatherDetail;
}

export const CurrentWeatherView: React.FC<CurrentWeatherViewProps> = ({
  data,
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

  // Weather icon URL from OpenWeatherMap
  //   const iconUrl = `http://openweathermap.org/img/wn/${data.weather.icon}@2x.png`;
  return (
    <div>
      {/* <div className="mb-4 text-xl font-bold">Results for {data.name}</div> */}
      <div className="flex flex-row items-center border border-gray-300 rounded p-4 space-x-4">
        <div className="flex-shrink-0">
          <img
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
        {/* Column 3: Additional Details */}
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
        {/* Column 4: Weather Summary */}
        <div className="flex flex-col items-end flex-grow">
          <h1 className="text-4xl font-bold">{weatherMetadata?.main}</h1>
          <h2 className="text-2xl">{formattedTime}</h2>
          <h3 className="text-xl capitalize">{weatherMetadata?.description}</h3>
        </div>
      </div>
    </div>
  );
};
