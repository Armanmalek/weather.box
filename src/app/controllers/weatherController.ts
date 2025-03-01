// import { WeatherData } from '../models/weather';
// import { fetchCurrentWeather } from '../services/weatherService';
// import {
//   convertKelvinToCelsius,
//   convertKelvinToFahrenheit,
// } from '../utils/conversionUtils';

// export interface ProcessedWeatherData {
//   id: number;
//   name: string;
//   temperature: {
//     celsius: number;
//     fahrenheit: number;
//   };
//   weather: {
//     main: string;
//     description: string;
//     icon: string;
//   };
//   rain?: {
//     '1h'?: number;
//   };
//   pressure: number;
//   humidity: number;
//   windSpeedKmh: number;
//   timestamp: number;
// }

// export async function getProcessedWeather(
//   cityID: string,
// ): Promise<ProcessedWeatherData> {
//   const rawData: WeatherData = await fetchCurrentWeather(cityID);

//   return {
//     id: rawData.id,
//     name: rawData.name,
//     temperature: {
//       celsius: Number(convertKelvinToCelsius(rawData.main.temp).toFixed(1)),
//       fahrenheit: Number(
//         convertKelvinToFahrenheit(rawData.main.temp).toFixed(1),
//       ),
//     },
//     weather: {
//       main: rawData.weather[0].main,
//       description: rawData.weather[0].description,
//       icon: rawData.weather[0].icon,
//     },
//     pressure: rawData.main.pressure,
//     humidity: rawData.main.humidity,
//     windSpeedKmh: Number((rawData.wind.speed * 3.6).toFixed(1)),
//     timestamp: rawData.dt,
//   };
// }
// src/controllers/weatherController.ts

// import { DisplayableWeatherData, WeatherData } from '../models/weather'; // raw weather data interface
// import { fetchCurrentWeather } from '../services/weatherService';
// import {
//   convertKelvinToCelsius,
//   convertKelvinToFahrenheit,
//   createIconImageURL,
// } from '../utils/conversionUtils';

// export async function getProcessedWeather(
//   cityID: string,
// ): Promise<DisplayableWeatherData> {
//   const rawData: WeatherData = await fetchCurrentWeather(cityID);

//   // Process the time here rather than in the component
//   const formattedTime = new Date(rawData.dt * 1000).toLocaleTimeString([], {
//     hour: '2-digit',
//     minute: '2-digit',
//   });

//   return {
//     id: rawData.id,
//     name: rawData.name,
//     temperature: {
//       celsius: convertKelvinToCelsius(rawData.main.temp),
//       fahrenheit: convertKelvinToFahrenheit(rawData.main.temp),
//     },
//     feelsLikeTemperature: {
//       celsius: convertKelvinToCelsius(rawData.main.feels_like),
//       fahrenheit: convertKelvinToFahrenheit(rawData.main.feels_like),
//     },
//     weather: {
//       main: rawData.weather[0].main,
//       description: rawData.weather[0].description,
//       icon: createIconImageURL(rawData.weather[0].icon),
//     },
//     pressure: rawData.main.pressure,
//     humidity: rawData.main.humidity,
//     windSpeedKmh: Number((rawData.wind.speed * 3.6).toFixed(1)),
//     timestamp: formattedTime,
//     rain: rawData.rain,
//   };
// }

// import type { ForecastData, ForecastEntry } from '../models/forecast';
// import type { DisplayableWeatherData } from '../models/displayedWeather';
// import type { ForecastEntryData } from '../models/forecastEntryData';
// import {
//   convertUnixToEasternDateString,
//   getEasternNoonTimestamp,
//   findClosestTimestamp,
//   processForecastEntryToDisplayable,
// } from '../utils/forecastUtils';

// // This function processes raw ForecastData and returns an object mapping date to ForecastEntryData.
// export function processForecastData(forecastData: ForecastData): {
//   [date: string]: ForecastEntryData;
// } {
//   const forecastByDay: { [date: string]: ForecastEntryData } = {};

//   // Loop through each forecast entry from the API
//   forecastData.list.forEach((entry: ForecastEntry) => {
//     const dayKey = convertUnixToEasternDateString(entry.dt);
//     // Initialize for the day if it doesn't exist
//     if (!forecastByDay[dayKey]) {
//       forecastByDay[dayKey] = {
//         representativeWeather: { main: '', description: '', icon: '' },
//         minTemp: entry.main.temp, // start with this entry's temperature
//         maxTemp: entry.main.temp,
//         displayedWeather: {},
//       };
//     }

//     // Update min and max temperatures (we're using Kelvin here; conversion can be done later)
//     forecastByDay[dayKey].minTemp = Math.min(
//       forecastByDay[dayKey].minTemp,
//       entry.main.temp,
//     );
//     forecastByDay[dayKey].maxTemp = Math.max(
//       forecastByDay[dayKey].maxTemp,
//       entry.main.temp,
//     );

//     // Process this forecast entry into a DisplayableWeatherData object
//     const displayable = processForecastEntryToDisplayable(entry);

//     // Store it keyed by the dt value
//     forecastByDay[dayKey].displayedWeather[entry.dt] = displayable;
//   });

//   // Now, for each day, select the representative weather (using the entry closest to noon)
//   for (const day in forecastByDay) {
//     const noonTimestamp = getEasternNoonTimestamp(day);
//     const displayed = forecastByDay[day].displayedWeather;
//     const closestTimestamp = findClosestTimestamp(displayed, noonTimestamp);
//     const repDisplayable = displayed[closestTimestamp];
//     forecastByDay[day].representativeWeather = repDisplayable.weather;
//   }

//   return forecastByDay;
// }

import {
  DailyForecast,
  ExtendedForecast,
  ForecastData,
} from '../models/forecast';
import { TodaysForecastData } from '../models/weather';
import { fetchWeatherDataForCity } from '../services/weatherService';
import {
  getLowestTemperature,
  getMostCommonWeather,
  getHighestTemperature,
  getWeatherDetail,
  groupForecastEntriesByDate,
  parseWeatherDetail,
  getTimeOfHighestTemperature,
} from '../utils/controllerUtils';

export async function getForecast(cityID: string) {
  const rawData: {
    todaysForecast: TodaysForecastData | null;
    extendedForecast: ForecastData | null;
  } = await fetchWeatherDataForCity(cityID);

  const todaysForecast = parseWeatherDetail(rawData.todaysForecast);
  const extendedForecast = parseExtendedForecast(rawData.extendedForecast);
  return { todaysForecast, extendedForecast };
}

export function parseExtendedForecast(
  rawData: ForecastData | null,
): ExtendedForecast | null {
  if (rawData === null) {
    return null;
  }
  const extendedWeather: { [dt: string]: DailyForecast } = {};

  const groups = groupForecastEntriesByDate(rawData);

  for (const date in groups) {
    const mostCommonWeather = getMostCommonWeather(groups[date]);
    const highestTemperature = getHighestTemperature(groups[date]);
    const timeOfHighestTemperature = getTimeOfHighestTemperature(
      highestTemperature,
      groups[date],
      rawData.city.timezone,
    );
    const lowestTemperature = getLowestTemperature(groups[date]);
    const weatherDetail = getWeatherDetail(groups[date], rawData.city.timezone);
    extendedWeather[date] = {
      mostCommonWeather,
      highestTemperature,
      lowestTemperature,
      weatherDetail,
      timeOfHighestTemperature,
    };
  }
  return extendedWeather;
}

// export function parseWeatherDetail(
//   rawData: TodaysForecastData | ForecastDataEntry | null,
// ) {
//   if (rawData === null) {
//     return null;
//   }

//   const formattedTime = new Date(rawData.dt * 1000).toLocaleTimeString([], {
//     hour: '2-digit',
//     minute: '2-digit',
//   });

//   return {
//     temperature: {
//       celsius: convertKelvinToCelsius(rawData.main.temp),
//       fahrenheit: convertKelvinToFahrenheit(rawData.main.temp),
//     },
//     feelsLikeTemperature: {
//       celsius: convertKelvinToCelsius(rawData.main.feels_like),
//       fahrenheit: convertKelvinToFahrenheit(rawData.main.feels_like),
//     },
//     weather: {
//       main: rawData.weatherMetadata[0].main,
//       description: rawData.weatherMetadata[0].description,
//       icon: createIconImageURL(rawData.weatherMetadata[0].icon),
//     },
//     pressure: rawData.main.pressure,
//     humidity: rawData.main.humidity,
//     windSpeedKmh: convertWindSpeed(rawData.wind.speed),
//     timestamp: formattedTime,
//     rain: rawData.rain,
//   };
// }
