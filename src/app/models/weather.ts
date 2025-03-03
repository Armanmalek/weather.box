export interface WeatherMetadata {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export type TempUnit = 'C' | 'F';

export interface MainWeather {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface Wind {
  speed: number;
  deg: number;
}

export interface Sys {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface TodaysForecastData {
  coord: { lon: number; lat: number };
  weather: WeatherMetadata[];
  base: string;
  main: MainWeather;
  visibility: number;
  wind: Wind;
  clouds: { all: number };
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
  snow?: {
    '1h'?: number;
    '3h'?: number;
  };
}

export interface WeatherDetail {
  formattedTime: string; // Pre-formatted for display (computed in the controller)
  temperature: {
    celsius: number;
    fahrenheit: number;
  };
  feelsLikeTemperature: {
    celsius: number;
    fahrenheit: number;
  };
  weatherMetadata: {
    main: string;
    description: string;
    icon: string;
  };
  pressure: number;
  humidity: number;
  windSpeedKmh: number;
  precipitation?: number; // e.g. rainfall in mm, if available
  rain?: number;
  snow?: number;
}
