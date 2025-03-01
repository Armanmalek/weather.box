import { TempUnit, WeatherDetail } from '../models/weather';

export function convertKelvinToCelsius(kelvin: number): number {
  return Math.round(kelvin - 273.15);
}

export function convertKelvinToFahrenheit(kelvin: number): number {
  return Math.round((kelvin - 273.15) * (9 / 5) + 32);
}

export function convertMsToKmh(ms: number): number {
  return ms * 3.6;
}

export function createIconImageURL(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

export function getFormattedTemperature(data: WeatherDetail, unit: TempUnit) {
  const formattedFeelsLikeTemp =
    unit === 'C'
      ? data.feelsLikeTemperature.celsius
      : data.feelsLikeTemperature.fahrenheit;
  const formattedTemp =
    unit === 'C' ? data.temperature.celsius : data.temperature.fahrenheit;

  return {
    formattedTemp,
    formattedFeelsLikeTemp,
  };
}

export function convertWindSpeed(speed: number): number {
  return Math.round(speed * 3.6);
}

export function getTodaysDate(): string {
  const ET_OFFSET = 18000000;
  const unixTime = new Date().getTime() - ET_OFFSET;
  return new Date(unixTime).toISOString().split('T')[0];
}
