import { getForecastData, createDataPoint } from './ForecastGraph';
import '@testing-library/jest-dom';
import { WeatherDetail } from '../models/weather';
import { ExtendedForecast } from '../models/forecast';

const mockForecast: ExtendedForecast = {
  '2025-03-02': {
    mostCommonWeather: {
      main: 'Snow',
      description: 'light snow',
      icon: '13d',
    },
    highestTemperature: 266.08,
    lowestTemperature: 263.46,
    weatherDetail: {
      '1740920400': {
        temperature: { celsius: -10, fahrenheit: 15 },
        feelsLikeTemperature: { celsius: -15, fahrenheit: 6 },
        weatherMetadata: {
          main: 'Clouds',
          description: 'overcast clouds',
          icon: 'https://openweathermap.org/img/wn/04d@2x.png',
        },
        pressure: 1024,
        humidity: 67,
        windSpeedKmh: 9,
        formattedTime: '01:00 PM',
      },
      '1740931200': {
        temperature: { celsius: -7, fahrenheit: 19 },
        feelsLikeTemperature: { celsius: -12, fahrenheit: 11 },
        weatherMetadata: {
          main: 'Snow',
          description: 'light snow',
          icon: 'https://openweathermap.org/img/wn/13d@2x.png',
        },
        pressure: 1022,
        humidity: 67,
        windSpeedKmh: 11,
        formattedTime: '04:00 PM',
        snow: 0.2,
      },
      '1740942000': {
        temperature: { celsius: -8, fahrenheit: 18 },
        feelsLikeTemperature: { celsius: -8, fahrenheit: 18 },
        weatherMetadata: {
          main: 'Snow',
          description: 'light snow',
          icon: 'https://openweathermap.org/img/wn/13n@2x.png',
        },
        pressure: 1023,
        humidity: 96,
        windSpeedKmh: 4,
        formattedTime: '07:00 PM',
        snow: 0.48,
      },
    },
    timeOfHighestTemperature: 1740931200,
  },
  '2025-03-05': {
    mostCommonWeather: {
      main: 'Clouds',
      description: 'broken clouds',
      icon: '04n',
    },
    highestTemperature: 276.62,
    lowestTemperature: 276.08,
    weatherDetail: {
      '1741168800': {
        temperature: { celsius: 3, fahrenheit: 38 },
        feelsLikeTemperature: { celsius: 1, fahrenheit: 33 },
        weatherMetadata: {
          main: 'Rain',
          description: 'light rain',
          icon: 'https://openweathermap.org/img/wn/10d@2x.png',
        },
        pressure: 993,
        humidity: 99,
        windSpeedKmh: 11,
        formattedTime: '10:00 AM',
        rain: 0.12,
      },
      '1741212000': {
        temperature: { celsius: 3, fahrenheit: 37 },
        feelsLikeTemperature: { celsius: 0, fahrenheit: 32 },
        weatherMetadata: {
          main: 'Clouds',
          description: 'broken clouds',
          icon: 'https://openweathermap.org/img/wn/04n@2x.png',
        },
        pressure: 989,
        humidity: 92,
        windSpeedKmh: 12,
        formattedTime: '10:00 PM',
      },
    },
    timeOfHighestTemperature: 1741168800,
  },
  '2025-03-06': {
    mostCommonWeather: {
      main: 'Rain',
      description: 'light rain',
      icon: '10n',
    },
    highestTemperature: 275.64,
    lowestTemperature: 275.64,
    weatherDetail: {
      '1741222800': {
        temperature: { celsius: 2, fahrenheit: 36 },
        feelsLikeTemperature: { celsius: -2, fahrenheit: 29 },
        weatherMetadata: {
          main: 'Rain',
          description: 'light rain',
          icon: 'https://openweathermap.org/img/wn/10n@2x.png',
        },
        pressure: 988,
        humidity: 97,
        windSpeedKmh: 18,
        formattedTime: '01:00 AM',
        rain: 0.14,
      },
    },
    timeOfHighestTemperature: 1741222800,
  },
};

const mockWeatherDetail: WeatherDetail = {
  temperature: { celsius: -11, fahrenheit: 13 },
  feelsLikeTemperature: { celsius: -16, fahrenheit: 3 },
  weatherMetadata: {
    main: 'Clouds',
    description: 'overcast clouds',
    icon: 'https://openweathermap.org/img/wn/04d@2x.png',
  },
  pressure: 1025,
  humidity: 61,
  windSpeedKmh: 10,
  formattedTime: '10:59 AM',
};

describe('ForecastGraph', () => {
  it('creates a data point correctly', () => {
    const dataPoint = createDataPoint(mockWeatherDetail, 'C', '2023-10-01');
    expect(dataPoint).toEqual({
      name: '10:59 AM',
      precipitation: 0,
      wind: 10,
      temperature: -11,
      timestamp: '10:59 AM',
      forecastDate: '2023-10-01',
      weatherDetail: mockWeatherDetail,
    });
  });

  it('gets forecast data correctly for today', () => {
    const data = getForecastData(mockForecast, '2025-03-02', 'C');
    expect(data.length).toBe(6);
    expect(data[0].temperature).toBe(-10);
  });
});
