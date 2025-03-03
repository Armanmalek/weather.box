import { getForecast, parseExtendedForecast } from './weatherController';
import { fetchWeatherDataForCity } from '../services/weatherService';
import { ForecastData } from '../models/forecast';

jest.mock('../services/weatherService');
// jest.mock('../utils/controllerUtils');
const mockRawData = {
  todaysForecast: {
    coord: {
      lon: -79.4163,
      lat: 43.7001,
    },
    weather: [
      {
        id: 804,
        main: 'Clouds',
        description: 'overcast clouds',
        icon: '04d',
      },
    ],
    base: 'stations',
    main: {
      temp: 262.44,
      feels_like: 257.19,
      temp_min: 261.21,
      temp_max: 263.42,
      pressure: 1025,
      humidity: 61,
      sea_level: 1025,
      grnd_level: 1007,
    },
    visibility: 10000,
    wind: {
      speed: 2.68,
      deg: 241,
      gust: 6.26,
    },
    clouds: {
      all: 100,
    },
    dt: 1740931179,
    sys: {
      type: 2,
      id: 2099289,
      country: 'CA',
      sunrise: 1740916345,
      sunset: 1740956845,
    },
    timezone: -18000,
    id: 6167865,
    name: 'Toronto',
    cod: 200,
  },
  extendedForecast: {
    cod: '200',
    message: 0,
    cnt: 40,
    list: [
      {
        dt: 1740938400,
        main: {
          temp: 263.46,
          feels_like: 258.64,
          temp_min: 263.46,
          temp_max: 265.59,
          pressure: 1024,
          sea_level: 1024,
          grnd_level: 1006,
          humidity: 67,
          temp_kf: -2.13,
        },
        weather: [
          {
            id: 804,
            main: 'Clouds',
            description: 'overcast clouds',
            icon: '04d',
          },
        ],
        clouds: {
          all: 85,
        },
        wind: {
          speed: 2.51,
          deg: 263,
          gust: 5.43,
        },
        visibility: 1873,
        pop: 0,
        sys: {
          pod: 'd',
        },
        dt_txt: '2025-03-02 18:00:00',
      },
      {
        dt: 1740949200,
        main: {
          temp: 266.08,
          feels_like: 261.22,
          temp_min: 266.08,
          temp_max: 267.92,
          pressure: 1022,
          sea_level: 1022,
          grnd_level: 1004,
          humidity: 67,
          temp_kf: -1.84,
        },
        weather: [
          {
            id: 600,
            main: 'Snow',
            description: 'light snow',
            icon: '13d',
          },
        ],
        clouds: {
          all: 100,
        },
        wind: {
          speed: 2.94,
          deg: 298,
          gust: 5.41,
        },
        visibility: 10000,
        pop: 0.21,
        snow: {
          '3h': 0.2,
        },
        sys: {
          pod: 'd',
        },
        dt_txt: '2025-03-02 21:00:00',
      },
      {
        dt: 1740960000,
        main: {
          temp: 265.23,
          feels_like: 265.23,
          temp_min: 265.23,
          temp_max: 265.23,
          pressure: 1023,
          sea_level: 1023,
          grnd_level: 1005,
          humidity: 96,
          temp_kf: 0,
        },
        weather: [
          {
            id: 600,
            main: 'Snow',
            description: 'light snow',
            icon: '13n',
          },
        ],
        clouds: {
          all: 100,
        },
        wind: {
          speed: 1.17,
          deg: 355,
          gust: 1.99,
        },
        visibility: 10000,
        pop: 0.55,
        snow: {
          '3h': 0.48,
        },
        sys: {
          pod: 'n',
        },
        dt_txt: '2025-03-03 00:00:00',
      },
      {
        dt: 1741186800,
        main: {
          temp: 276.62,
          feels_like: 273.83,
          temp_min: 276.62,
          temp_max: 276.62,
          pressure: 993,
          sea_level: 993,
          grnd_level: 977,
          humidity: 99,
          temp_kf: 0,
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
          all: 100,
        },
        wind: {
          speed: 2.99,
          deg: 101,
          gust: 9.1,
        },
        visibility: 2920,
        pop: 0.3,
        rain: {
          '3h': 0.12,
        },
        sys: {
          pod: 'd',
        },
        dt_txt: '2025-03-05 15:00:00',
      },
      {
        dt: 1741230000,
        main: {
          temp: 276.08,
          feels_like: 272.95,
          temp_min: 276.08,
          temp_max: 276.08,
          pressure: 989,
          sea_level: 989,
          grnd_level: 972,
          humidity: 92,
          temp_kf: 0,
        },
        weather: [
          {
            id: 803,
            main: 'Clouds',
            description: 'broken clouds',
            icon: '04n',
          },
        ],
        clouds: {
          all: 75,
        },
        wind: {
          speed: 3.29,
          deg: 212,
          gust: 8.75,
        },
        visibility: 10000,
        pop: 0,
        sys: {
          pod: 'n',
        },
        dt_txt: '2025-03-06 03:00:00',
      },
      {
        dt: 1741240800,
        main: {
          temp: 275.64,
          feels_like: 271.3,
          temp_min: 275.64,
          temp_max: 275.64,
          pressure: 988,
          sea_level: 988,
          grnd_level: 972,
          humidity: 97,
          temp_kf: 0,
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
          all: 88,
        },
        wind: {
          speed: 5.1,
          deg: 216,
          gust: 12.88,
        },
        pop: 0.2,
        rain: {
          '3h': 0.14,
        },
        sys: {
          pod: 'n',
        },
        dt_txt: '2025-03-06 06:00:00',
      },
    ],
    city: {
      id: 6167865,
      name: 'Toronto',
      coord: {
        lat: 43.7001,
        lon: -79.4163,
      },
      country: 'CA',
      population: 0,
      timezone: -18000,
      sunrise: 1740916345,
      sunset: 1740956845,
    },
  },
};

const expected = {
  todaysForecast: {
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
  },
  extendedForecast: {
    '2025-03-02': {
      mostCommonWeather: {
        id: 600,
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
          formattedTime: '1:00 PM',
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
          formattedTime: '4:00 PM',
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
          formattedTime: '7:00 PM',
          snow: 0.48,
        },
      },
      timeOfHighestTemperature: 1740931200,
    },
    '2025-03-05': {
      mostCommonWeather: {
        id: 803,
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
        id: 500,
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
          formattedTime: '1:00 AM',
          rain: 0.14,
        },
      },
      timeOfHighestTemperature: 1741222800,
    },
  },
  name: 'Toronto',
};

describe('weatherController', () => {
  describe('getForecast', () => {
    it('should return parsed forecast data for a given city', async () => {
      const cityID = '12345';
      (fetchWeatherDataForCity as jest.Mock).mockResolvedValue(mockRawData);
      const result = await getForecast(cityID);
      expect(fetchWeatherDataForCity).toHaveBeenCalledWith(cityID);
      expect(result).toEqual(expected);
    });

    it('should return null for todaysForecast and extendedForecast if no data is available', async () => {
      const cityID = '12345';
      const mockRawData = {
        todaysForecast: null,
        extendedForecast: null,
      };

      (fetchWeatherDataForCity as jest.Mock).mockResolvedValue(mockRawData);

      const result = await getForecast(cityID);

      expect(fetchWeatherDataForCity).toHaveBeenCalledWith(cityID);
      expect(result).toEqual({
        todaysForecast: null,
        name: '',
        extendedForecast: null,
      });
    });
  });

  describe('parseExtendedForecast', () => {
    it('should return null if rawData is null', () => {
      const result = parseExtendedForecast(null);
      expect(result).toBeNull();
    });

    it('should return parsed extended forecast data', () => {
      const result = parseExtendedForecast(
        mockRawData.extendedForecast as ForecastData,
      );

      expect(result).toEqual(expected.extendedForecast);
    });
  });
});
