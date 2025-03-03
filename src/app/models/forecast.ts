import { WeatherDetail, WeatherMetadata } from './weather';

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
  weatherDetail: {
    [dt: number]: WeatherDetail;
  };
}

export interface ExtendedForecast {
  [dt: string]: DailyForecast;
}
