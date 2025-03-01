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
  const weatherDetail: { [dt: number]: WeatherDetail } = {};

  console.log('fef', forecastDataEntries);

  forecastDataEntries.forEach((entry) => {
    const { dt } = entry;
    const result = parseWeatherDetail(entry);
    if (result !== null) {
      weatherDetail[dt + timezoneOffset] = result;
    }
  });

  return weatherDetail;
}

export function parseWeatherDetail(
  rawData: TodaysForecastData | ForecastDataEntry | null,
): WeatherDetail | null {
  if (rawData === null) {
    return null;
  }

  const formattedTime = new Date(rawData.dt * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  //   console.log('about to shit', rawData.weatherMetadata, rawData);

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

// export function aggregateDailyForecast(
//   entries: ForecastEntry[],
//   timezoneOffset: number,
// ): ExtendedForecast {
//   // Initialize min and max using the first entry's temperature
//   let minTemp = entries[0].main.temp;
//   let maxTemp = entries[0].main.temp;

//   // Build a dictionary of DisplayableWeatherData objects keyed by dt
//   const displayedWeather: { [dt: number]: DisplayableWeatherData } = {};

//   entries.forEach((entry) => {
//     // Update min/max temperatures (we work in Kelvin; conversion can be done later in the UI if needed)
//     if (entry.main.temp < minTemp) minTemp = entry.main.temp;
//     if (entry.main.temp > maxTemp) maxTemp = entry.main.temp;

//     const displayable = processForecastEntryToDisplayable(entry);
//     displayedWeather[entry.dt] = displayable;
//   });

//   // Use the date from the first entry (adjusted by timezone) as the key
//   const localDateStr = new Date((entries[0].dt + timezoneOffset) * 1000)
//     .toISOString()
//     .split('T')[0];
//   const noonTimestamp = getNoonTimestampForDate(localDateStr);
//   const closestTs = findClosestTimestamp(displayedWeather, noonTimestamp);
//   const repDisplayable = displayedWeather[closestTs];

//   return {
//     date: localDateStr,
//     dayOfWeek: new Date(localDateStr).toLocaleDateString('en-US', {
//       weekday: 'long',
//     }),
//     representativeWeather: repDisplayable.weather,
//     minTemp,
//     maxTemp,
//     displayedWeather,
//   };
// }
