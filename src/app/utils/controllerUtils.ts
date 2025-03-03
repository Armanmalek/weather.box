import {
  ForecastData,
  ForecastDataEntry,
  MostCommonWeather,
} from '../models/forecast';
import { TodaysForecastData, WeatherDetail } from '../models/weather';
import {
  convertKelvinToCelsius,
  convertKelvinToFahrenheit,
  convertWindSpeed,
  createIconImageURL,
} from './weatherUtils';

export function convertUnixtoLocalTimestamp(
  unix: number,
  timezoneOffset: number,
): number {
  return (unix + timezoneOffset) * 1000;
}

export function convertUnixToWeekday(unix: number) {
  return new Date(unix * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
  });
}

export function convertUnixToLocalTime(
  unix: number,
  timezoneOffset: number,
): string {
  return new Date(
    convertUnixtoLocalTimestamp(unix, timezoneOffset),
  ).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function convertUnixToLocalDateString(
  unix: number,
  timezoneOffset: number,
): string {
  return new Date(convertUnixtoLocalTimestamp(unix, timezoneOffset))
    .toISOString()
    .split('T')[0];
}

export function groupForecastEntriesByDate(rawData: ForecastData): {
  [date: string]: ForecastDataEntry[];
} {
  const groups: { [date: string]: ForecastDataEntry[] } = {};
  const timezoneOffset = rawData.city.timezone; // in seconds

  rawData.list.forEach((entry) => {
    const dateStr = convertUnixToLocalDateString(entry.dt, timezoneOffset);
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(entry);
  });

  return groups;
}

export function getTimeOfHighestTemperature(
  highestTemperature: number,
  forecastDataEntries: ForecastDataEntry[],
  timezoneOffset: number,
) {
  const entry = forecastDataEntries.find(
    (forecastDataEntry) => forecastDataEntry.main.temp === highestTemperature,
  )!;

  return entry.dt + timezoneOffset;
}

export function getHighestTemperature(
  forecastDataEntries: ForecastDataEntry[],
): number {
  return forecastDataEntries.reduce((max, entry) => {
    return entry.main.temp > max ? entry.main.temp : max;
  }, forecastDataEntries[0].main.temp);
}

export function getLowestTemperature(
  forecastDataEntries: ForecastDataEntry[],
): number {
  return forecastDataEntries.reduce((min, entry) => {
    return entry.main.temp < min ? entry.main.temp : min;
  }, forecastDataEntries[0].main.temp);
}

export function getMostCommonWeather(
  forecastDataEntries: ForecastDataEntry[],
): MostCommonWeather {
  const weatherCounts: { [weather: string]: number } = {};

  forecastDataEntries.forEach((entry) => {
    const { main } = entry.weather[0];
    const key = main;
    if (weatherCounts[key]) {
      weatherCounts[key]++;
    } else {
      weatherCounts[key] = 1;
    }
  });

  const mostCommon = Object.keys(weatherCounts).reduce((a, b) =>
    weatherCounts[a] > weatherCounts[b] ? a : b,
  );

  return (
    forecastDataEntries.find((entry) => entry.weather[0].main === mostCommon)
      ?.weather[0] || forecastDataEntries[0].weather[0]
  );
}

export function getWeatherDetail(
  forecastDataEntries: ForecastDataEntry[],
  timezoneOffset: number,
): { [dt: number]: WeatherDetail } {
  return forecastDataEntries.reduce((weatherDetail, entry) => {
    const { dt } = entry;
    const result = parseWeatherDetail(entry, timezoneOffset);
    if (result !== null) {
      weatherDetail[dt + timezoneOffset] = result;
    }
    return weatherDetail;
  }, {} as { [dt: number]: WeatherDetail });
}

export function parseWeatherDetail(
  rawData: TodaysForecastData | ForecastDataEntry | null,
  timezoneOffset: number = 0,
): WeatherDetail | null {
  if (rawData === null) {
    return null;
  }

  const formattedTime = new Date(
    (rawData.dt + timezoneOffset) * 1000,
  ).toLocaleTimeString('en-US', {
    timeZone: 'UTC',
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
  });

  return {
    temperature: {
      celsius: convertKelvinToCelsius(rawData.main.temp),
      fahrenheit: convertKelvinToFahrenheit(rawData.main.temp),
    },
    feelsLikeTemperature: {
      celsius: convertKelvinToCelsius(rawData.main.feels_like),
      fahrenheit: convertKelvinToFahrenheit(rawData.main.feels_like),
    },
    weatherMetadata: {
      main: rawData.weather[0].main,
      description: rawData.weather[0].description,
      icon: createIconImageURL(rawData.weather[0].icon),
    },
    pressure: rawData.main.pressure,
    humidity: rawData.main.humidity,
    windSpeedKmh: convertWindSpeed(rawData.wind.speed),
    formattedTime,
    rain: rawData?.rain?.['1h'] ?? rawData?.rain?.['3h'],
    snow: rawData?.snow?.['1h'] ?? rawData?.snow?.['3h'],
  };
}
