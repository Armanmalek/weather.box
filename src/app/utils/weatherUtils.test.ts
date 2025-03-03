import { WeatherDetail } from '../models/weather';
import {
  convertKelvinToFahrenheit,
  convertKelvinToCelsius,
  convertMsToKmh,
  createIconImageURL,
  getFormattedTemperature,
  getTodaysDate,
} from './weatherUtils';

const weatherDetail: WeatherDetail = {
  temperature: { celsius: 24, fahrenheit: 75 },
  feelsLikeTemperature: { celsius: 25, fahrenheit: 77 },
  weatherMetadata: {
    main: 'Rain',
    description: 'light rain',
    icon: 'https://openweathermap.org/img/wn/10d@2x.png',
  },
  pressure: 1013,
  humidity: 96,
  windSpeedKmh: 25,
  formattedTime: '04:00 PM',
  rain: 0.62,
  snow: undefined,
};

describe('conversions', () => {
  test('convertKelvinToFahrenheit rounds kelvin down correctly', () => {
    expect(convertKelvinToFahrenheit(273)).toBe(32);
  });
  test('convertKelvinToFahrenheit returns 0 correctly ', () => {
    expect(convertKelvinToFahrenheit(255.37)).toBe(0);
  });
  test('convertKelvinToFahrenheit rounds kelvin up correctly', () => {
    expect(convertKelvinToFahrenheit(280)).toBe(44);
  });
  test('convertKelvinToCelcius returns 0 correctly', () => {
    expect(convertKelvinToCelsius(273)).toBe(0);
  });
  test('convertKelvinToCelcius rounds down correctly', () => {
    expect(convertKelvinToCelsius(279.5)).toBe(6);
  });

  test('convertMsToKmh converst m/s to km/hr correctly', () => {
    expect(convertMsToKmh(1)).toBe(3.6);
  });

  test('createImageURL returns image url correctly', () => {
    expect(createIconImageURL('10n')).toBe(
      'https://openweathermap.org/img/wn/10n@2x.png',
    );
  });

  test('getFormattedTemperature returns celcius as expected', () => {
    const res = getFormattedTemperature(weatherDetail, 'C');
    expect(res.formattedTemp).toBe(24);
    expect(res.formattedFeelsLikeTemp).toBe(25);
  });
  test('getFormattedTemperature returns fahrenheit as expected', () => {
    const res = getFormattedTemperature(weatherDetail, 'F');
    expect(res.formattedTemp).toBe(75);
    expect(res.formattedFeelsLikeTemp).toBe(77);
  });

  test('convertWindSpeed converts m/s to km/h correctly', () => {
    expect(convertMsToKmh(1)).toBe(3.6);
  });

  test('getTodaysDate returns todays date correctly in EST', () => {
    const date = new Date();
    const ET_OFFSET = 18000000;
    const expected = new Date(date.getTime() - ET_OFFSET)
      .toISOString()
      .split('T')[0];
    expect(getTodaysDate()).toBe(expected);
  });
});
