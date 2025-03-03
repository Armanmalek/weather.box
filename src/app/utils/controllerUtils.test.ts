import { ForecastData } from '../models/forecast';
import {
  convertUnixtoLocalTimestamp,
  convertUnixToWeekday,
  convertUnixToLocalTime,
  convertUnixToLocalDateString,
  groupForecastEntriesByDate,
  getTimeOfHighestTemperature,
  getHighestTemperature,
  getLowestTemperature,
  getMostCommonWeather,
  getWeatherDetail,
  parseWeatherDetail,
} from './controllerUtils';

const rawData: ForecastData = {
  list: [
    {
      dt: 1740862800,
      main: {
        temp: 297.11,
        feels_like: 298.07,
        temp_min: 297.11,
        temp_max: 297.74,
        pressure: 1013,
        sea_level: 1013,
        grnd_level: 1005,
        humidity: 96,
        temp_kf: -0.63,
      },
      weather: [
        {
          id: 500,
          main: 'Rain',
          description: 'light rain',
          icon: '10d',
        },
      ],
      clouds: {
        all: 20,
      },
      wind: {
        speed: 7.05,
        deg: 94,
        gust: 8.8,
      },
      visibility: 10000,
      pop: 1,
      rain: {
        '3h': 0.62,
      },
      sys: {
        pod: 'd',
      },
      dt_txt: '2025-03-01 21:00:00',
    },
    {
      dt: 1740873600,
      main: {
        temp: 297.24,
        feels_like: 298.03,
        temp_min: 297.24,
        temp_max: 297.49,
        pressure: 1014,
        sea_level: 1014,
        grnd_level: 1006,
        humidity: 89,
        temp_kf: -0.25,
      },
      weather: [
        {
          id: 500,
          main: 'Rain',
          description: 'light rain',
          icon: '10n',
        },
      ],
      clouds: {
        all: 20,
      },
      wind: {
        speed: 7.22,
        deg: 87,
        gust: 9.72,
      },
      visibility: 10000,
      pop: 1,
      rain: {
        '3h': 0.54,
      },
      sys: {
        pod: 'n',
      },
      dt_txt: '2025-03-02 00:00:00',
    },
    {
      dt: 1740884400,
      main: {
        temp: 297.2,
        feels_like: 297.72,
        temp_min: 297.2,
        temp_max: 297.25,
        pressure: 1014,
        sea_level: 1014,
        grnd_level: 1007,
        humidity: 79,
        temp_kf: -0.05,
      },
      weather: [
        {
          id: 801,
          main: 'Clouds',
          description: 'few clouds',
          icon: '02n',
        },
      ],
      clouds: {
        all: 12,
      },
      wind: {
        speed: 6.96,
        deg: 80,
        gust: 9.22,
      },
      visibility: 10000,
      pop: 0,
      sys: {
        pod: 'n',
      },
      dt_txt: '2025-03-02 03:00:00',
    },
  ],
  city: {
    id: 3576468,
    name: 'Saint Lucia',
    coord: {
      lat: 13.8833,
      lon: -60.9667,
    },
    country: 'LC',
    population: 0,
    timezone: -14400,
    sunrise: 1740824418,
    sunset: 1740867143,
  },
};

describe('Unix', () => {
  test('should convert unix to local timestamp', () => {
    const unix = 1633072800;
    const timezoneOffset = 3600;
    const result = convertUnixtoLocalTimestamp(unix, timezoneOffset);
    expect(result).toBe(1633076400000);
  });

  test('should convert unix to weekday', () => {
    const unix = 1740848400;
    const result = convertUnixToWeekday(unix);
    expect(result).toBe('Sat');
  });

  test('should convert unix to local time', () => {
    const unix = 1740862800;
    const timezoneOffset = -14400;
    const result = convertUnixToLocalTime(unix, timezoneOffset);
    expect(result).toBe('12:00 PM');
  });

  test('should convert unix to local date string', () => {
    const unix = 1633072800;
    const timezoneOffset = 3600;
    const result = convertUnixToLocalDateString(unix, timezoneOffset);
    expect(result).toBe('2021-10-01');
  });
});

describe('Forecast Entries', () => {
  test('should group forecast entries by date', () => {
    const result = groupForecastEntriesByDate(rawData);
    const expected = {
      '2025-03-01': [
        {
          dt: 1740862800,
          main: {
            temp: 297.11,
            feels_like: 298.07,
            temp_min: 297.11,
            temp_max: 297.74,
            pressure: 1013,
            sea_level: 1013,
            grnd_level: 1005,
            humidity: 96,
            temp_kf: -0.63,
          },
          weather: [
            { id: 500, main: 'Rain', description: 'light rain', icon: '10d' },
          ],
          clouds: { all: 20 },
          wind: { speed: 7.05, deg: 94, gust: 8.8 },
          visibility: 10000,
          pop: 1,
          rain: { '3h': 0.62 },
          sys: { pod: 'd' },
          dt_txt: '2025-03-01 21:00:00',
        },
        {
          dt: 1740873600,
          main: {
            temp: 297.24,
            feels_like: 298.03,
            temp_min: 297.24,
            temp_max: 297.49,
            pressure: 1014,
            sea_level: 1014,
            grnd_level: 1006,
            humidity: 89,
            temp_kf: -0.25,
          },
          weather: [
            { id: 500, main: 'Rain', description: 'light rain', icon: '10n' },
          ],
          clouds: { all: 20 },
          wind: { speed: 7.22, deg: 87, gust: 9.72 },
          visibility: 10000,
          pop: 1,
          rain: { '3h': 0.54 },
          sys: { pod: 'n' },
          dt_txt: '2025-03-02 00:00:00',
        },
        {
          dt: 1740884400,
          main: {
            temp: 297.2,
            feels_like: 297.72,
            temp_min: 297.2,
            temp_max: 297.25,
            pressure: 1014,
            sea_level: 1014,
            grnd_level: 1007,
            humidity: 79,
            temp_kf: -0.05,
          },
          weather: [
            { id: 801, main: 'Clouds', description: 'few clouds', icon: '02n' },
          ],
          clouds: { all: 12 },
          wind: { speed: 6.96, deg: 80, gust: 9.22 },
          visibility: 10000,
          pop: 0,
          sys: { pod: 'n' },
          dt_txt: '2025-03-02 03:00:00',
        },
      ],
    };
    expect(result).toEqual(expected);
  });

  test('getMostCommonWeather gets most common weather descriptiojn', () => {
    const forecastDataEntries = rawData.list;
    const result = getMostCommonWeather(forecastDataEntries);
    expect(result.main).toBe('Rain');
  });
});

describe('Temperature', () => {
  test('should get time of highest temperature', () => {
    const forecastDataEntries = rawData.list;
    const highestTemperature = rawData.list[2].main.temp;
    const timezoneOffset = rawData.city.timezone;
    const result = getTimeOfHighestTemperature(
      highestTemperature,
      forecastDataEntries,
      timezoneOffset,
    );
    expect(result).toBe(rawData.list[2].dt + timezoneOffset);
  });

  test('should get highest temperature', () => {
    const forecastDataEntries = rawData.list;
    const result = getHighestTemperature(forecastDataEntries);
    expect(result).toBe(297.24);
  });

  test('should get lowest temperature', () => {
    const forecastDataEntries = rawData.list;
    const result = getLowestTemperature(forecastDataEntries);
    expect(result).toBe(297.11);
  });
});

describe('Weather Detail', () => {
  test('parseWeatherDetail returns null when passed no data', () => {
    const rawData = null;
    const result = parseWeatherDetail(rawData);
    expect(result).toBe(null);
  });

  test('parseWeatherDetail returns WeatherDetail from TodaysForecast or ForecastDataEntry', () => {
    const result = parseWeatherDetail(rawData.list[0]);
    const expected = {
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
      formattedTime: '9:00 PM',
      rain: 0.62,
      snow: undefined,
    };
    expect(result).toEqual(expected);
  });

  test('getWeatherDetail returns an object of WeatherDetail by timestamp', () => {
    const forecastDataEntries = rawData.list;
    const timezoneOffset = rawData.city.timezone;
    const result = getWeatherDetail(forecastDataEntries, timezoneOffset);
    const expected = {
      '1740848400': {
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
        formattedTime: '5:00 PM',
        rain: 0.62,
        snow: undefined,
      },
      '1740859200': {
        temperature: { celsius: 24, fahrenheit: 75 },
        feelsLikeTemperature: { celsius: 25, fahrenheit: 77 },
        weatherMetadata: {
          main: 'Rain',
          description: 'light rain',
          icon: 'https://openweathermap.org/img/wn/10n@2x.png',
        },
        pressure: 1014,
        humidity: 89,
        windSpeedKmh: 26,
        formattedTime: '8:00 PM',
        rain: 0.54,
        snow: undefined,
      },
      '1740870000': {
        temperature: { celsius: 24, fahrenheit: 75 },
        feelsLikeTemperature: { celsius: 25, fahrenheit: 76 },
        weatherMetadata: {
          main: 'Clouds',
          description: 'few clouds',
          icon: 'https://openweathermap.org/img/wn/02n@2x.png',
        },
        pressure: 1014,
        humidity: 79,
        windSpeedKmh: 25,
        formattedTime: '11:00 PM',
        rain: undefined,
        snow: undefined,
      },
    };
    expect(result).toEqual(expected);
  });
});
