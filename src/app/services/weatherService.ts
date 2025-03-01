import { ForecastData } from '../models/forecast';
import type { TodaysForecastData } from '../models/weather';

const CACHE_DURATION = 300000; // Cache duration: 5 minutes

const weatherCache: {
  [cityId: string]: {
    todaysForecast?: { data: TodaysForecastData; timestamp: number };
    extendedForecast?: { data: ForecastData; timestamp: number };
  };
} = {};

function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION;
}

async function fetchAndCache<T>(
  url: string,
  cacheEntry?: { data: T; timestamp: number },
): Promise<T> {
  if (cacheEntry && isCacheValid(cacheEntry.timestamp)) {
    return cacheEntry.data;
  }
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }
  const data: T = await res.json();
  return data;
}

export async function fetchWeatherDataForCity(cityId: string): Promise<{
  todaysForecast: TodaysForecastData | null;
  extendedForecast: ForecastData | null;
}> {
  const apiKey = process.env.APP_ID;
  if (!apiKey) {
    throw new Error('Missing APP_ID environment variable');
  }

  if (!weatherCache[cityId]) {
    weatherCache[cityId] = {};
  }

  const todaysForecastURL = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}`;
  const extendedForecastURL = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${apiKey}`;

  const [todaysForecast, extendedForecast] = await Promise.allSettled([
    fetchAndCache<TodaysForecastData>(
      todaysForecastURL,
      weatherCache[cityId].todaysForecast,
    ).then((data) => {
      weatherCache[cityId].todaysForecast = { data, timestamp: Date.now() };
      return data;
    }),
    fetchAndCache<ForecastData>(
      extendedForecastURL,
      weatherCache[cityId].extendedForecast,
    ).then((data) => {
      weatherCache[cityId].extendedForecast = { data, timestamp: Date.now() };
      return data;
    }),
  ]);

  return {
    todaysForecast:
      todaysForecast.status === 'fulfilled' ? todaysForecast.value : null,
    extendedForecast:
      extendedForecast.status === 'fulfilled' ? extendedForecast.value : null,
  };
}
