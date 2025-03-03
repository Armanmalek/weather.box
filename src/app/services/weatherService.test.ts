import { fetchWeatherDataForCity, weatherCache } from './weatherService';
import type { ForecastData } from '../models/forecast';
import type { TodaysForecastData } from '../models/weather';
import 'whatwg-fetch';

global.fetch = jest.fn();

describe('fetchWeatherDataForCity', () => {
  const cityId = '12345';
  const apiKey = 'test_api_key';

  const todaysForecastData: TodaysForecastData = {
    coord: { lon: -79.4163, lat: 43.7001 },
    weather: [
      { id: 804, main: 'Clouds', description: 'overcast clouds', icon: '04d' },
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
    wind: { speed: 2.68, deg: 241 },
    clouds: { all: 100 },
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
  };

  const extendedForecastData: ForecastData = {
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
        clouds: { all: 85 },
        wind: { speed: 2.51, deg: 263, gust: 5.43 },
        visibility: 1873,
        pop: 0,
        sys: { pod: 'd' },
        dt_txt: '2025-03-02 18:00:00',
      },
      {
        dt: 1741338000,
        main: {
          temp: 269.79,
          feels_like: 264.5,
          temp_min: 269.79,
          temp_max: 269.79,
          pressure: 1010,
          sea_level: 1010,
          grnd_level: 993,
          humidity: 67,
          temp_kf: 0,
        },
        weather: [
          {
            id: 802,
            main: 'Clouds',
            description: 'scattered clouds',
            icon: '03n',
          },
        ],
        clouds: { all: 33 },
        wind: { speed: 4.31, deg: 299, gust: 11.91 },
        visibility: 10000,
        pop: 0,
        sys: { pod: 'n' },
        dt_txt: '2025-03-07 09:00:00',
      },
      {
        dt: 1741359600,
        main: {
          temp: 272.4,
          feels_like: 267.83,
          temp_min: 272.4,
          temp_max: 272.4,
          pressure: 1011,
          sea_level: 1011,
          grnd_level: 994,
          humidity: 62,
          temp_kf: 0,
        },
        weather: [
          {
            id: 802,
            main: 'Clouds',
            description: 'scattered clouds',
            icon: '03d',
          },
        ],
        clouds: { all: 27 },
        wind: { speed: 4.17, deg: 266, gust: 7.97 },
        visibility: 10000,
        pop: 0,
        sys: { pod: 'd' },
        dt_txt: '2025-03-07 15:00:00',
      },
    ],
    city: {
      id: 6167865,
      name: 'Toronto',
      coord: { lat: 43.7001, lon: -79.4163 },
      country: 'CA',
      population: 0,
      timezone: -18000,
      sunrise: 1740916345,
      sunset: 1740956845,
    },
  };

  beforeAll(() => {
    process.env.APP_ID = apiKey;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear our in-memory cache between tests.
    Object.keys(weatherCache).forEach((key) => delete weatherCache[key]);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and return weather data for a city', async () => {
    // Mock fetch to return appropriate responses based on the URL.
    (fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('forecast?')) {
        return Promise.resolve(
          new Response(JSON.stringify(extendedForecastData)),
        );
      }
      if (url.includes('weather?')) {
        return Promise.resolve(
          new Response(JSON.stringify(todaysForecastData)),
        );
      }
      return Promise.reject(new Error('Invalid URL'));
    });

    const result = await fetchWeatherDataForCity(cityId);

    expect(result.extendedForecast).toEqual(extendedForecastData);
    expect(result.todaysForecast).toEqual(todaysForecastData);
  });

  it('should return null for todaysForecast if fetch fails', async () => {
    (fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('weather?')) {
        return Promise.reject(new Error('Failed to fetch'));
      }
      if (url.includes('forecast?')) {
        return Promise.resolve(
          new Response(JSON.stringify(extendedForecastData)),
        );
      }
      return Promise.reject(new Error('Invalid URL'));
    });

    const result = await fetchWeatherDataForCity(cityId);

    expect(result.todaysForecast).toBeNull();
    expect(result.extendedForecast).toEqual(extendedForecastData);
  });

  it('should return null for extendedForecast if fetch fails', async () => {
    (fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('weather?')) {
        return Promise.resolve(
          new Response(JSON.stringify(todaysForecastData)),
        );
      }
      if (url.includes('forecast?')) {
        return Promise.reject(new Error('Failed to fetch'));
      }
      return Promise.reject(new Error('Invalid URL'));
    });

    const result = await fetchWeatherDataForCity(cityId);

    expect(result.todaysForecast).toEqual(todaysForecastData);
    expect(result.extendedForecast).toBeNull();
  });

  it('should cache the results of the fetch', async () => {
    (fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('weather?')) {
        return Promise.resolve(
          new Response(JSON.stringify(todaysForecastData)),
        );
      }
      if (url.includes('forecast?')) {
        return Promise.resolve(
          new Response(JSON.stringify(extendedForecastData)),
        );
      }
      return Promise.reject(new Error('Invalid URL'));
    });

    await fetchWeatherDataForCity(cityId);
    await fetchWeatherDataForCity(cityId);

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('should throw an error if APP_ID is not set', async () => {
    delete process.env.APP_ID;
    await expect(fetchWeatherDataForCity(cityId)).rejects.toThrow(
      'Missing APP_ID environment variable',
    );
  });
});
