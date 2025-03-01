// src/models/dailyForecast.ts

import { WeatherDetail, WeatherMetadata } from './weather';

// // src/models/forecastEntry.ts
// export interface ForecastEntry {
//   timestamp: number;
//   formattedTime: string;
//   temperature: {
//     celsius: number;
//     fahrenheit: number;
//   };
//   weather: {
//     main: string;
//     description: string;
//     icon: string;
//   };
//   windSpeedKmh: number;
//   precipitation?: number;
// }

export interface ForecastDataEntry {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: WeatherMetadata[];
  clouds: { all: number };
  wind: { speed: number; deg: number; gust?: number };
  visibility: number;
  pop: number;
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
  snow?: {
    '1h'?: number;
    '3h'?: number;
  };
  sys: { pod: string };
  dt_txt: string;
}

export interface ForecastData {
  list: ForecastDataEntry[];
  city: {
    id: number;
    name: string;
    coord: { lat: number; lon: number };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface MostCommonWeather {
  main: string;
  description: string;
  icon: string;
}

export interface DailyForecast {
  mostCommonWeather: MostCommonWeather;
  lowestTemperature: number;
  timeOfHighestTemperature: number;
  highestTemperature: number;
  // A dictionary mapping Unix timestamps (dt) to the processed DisplayedWeatherData for that time.
  weatherDetail: {
    [dt: number]: WeatherDetail;
  };
}

export interface ExtendedForecast {
  [dt: string]: DailyForecast;
}
