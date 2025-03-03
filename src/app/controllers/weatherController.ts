import {
  DailyForecast,
  ExtendedForecast,
  ForecastData,
} from '../models/forecast';
import { TodaysForecastData } from '../models/weather';
import { fetchWeatherDataForCity } from '../services/weatherService';
import {
  getLowestTemperature,
  getMostCommonWeather,
  getHighestTemperature,
  getWeatherDetail,
  groupForecastEntriesByDate,
  parseWeatherDetail,
  getTimeOfHighestTemperature,
} from '../utils/controllerUtils';

export async function getForecast(cityID: string) {
  const rawData: {
    todaysForecast: TodaysForecastData | null;
    extendedForecast: ForecastData | null;
  } = await fetchWeatherDataForCity(cityID);
  const todaysForecast = parseWeatherDetail(
    rawData.todaysForecast,
    rawData.todaysForecast?.timezone,
  );
  const extendedForecast = parseExtendedForecast(rawData.extendedForecast);
  return {
    todaysForecast,
    extendedForecast,
    name:
      rawData.todaysForecast?.name || rawData.extendedForecast?.city.name || '',
  };
}

export function parseExtendedForecast(
  rawData: ForecastData | null,
): ExtendedForecast | null {
  if (rawData === null) {
    return null;
  }
  const extendedWeather: { [dt: string]: DailyForecast } = {};

  const groups = groupForecastEntriesByDate(rawData);

  for (const date in groups) {
    const mostCommonWeather = getMostCommonWeather(groups[date]);
    const highestTemperature = getHighestTemperature(groups[date]);
    const timeOfHighestTemperature = getTimeOfHighestTemperature(
      highestTemperature,
      groups[date],
      rawData.city.timezone,
    );
    const lowestTemperature = getLowestTemperature(groups[date]);
    const weatherDetail = getWeatherDetail(groups[date], rawData.city.timezone);
    extendedWeather[date] = {
      mostCommonWeather,
      highestTemperature,
      lowestTemperature,
      weatherDetail,
      timeOfHighestTemperature,
    };
  }
  return extendedWeather;
}
