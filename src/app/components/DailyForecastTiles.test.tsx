import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DailyForecastTiles from './DailyForecastTiles';
import { WeatherProvider } from '../context/weatherContext';
import type { ExtendedForecast } from '@/app/models/forecast';

const mockForecast: ExtendedForecast = {
  '2023-10-01': {
    highestTemperature: 300,
    lowestTemperature: 280,
    timeOfHighestTemperature: 1633072800,
    mostCommonWeather: { main: 'Clear', icon: '01d', description: 'clear sky' },
    weatherDetail: {
      1633072800: {
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
    },
  },
  '2023-10-02': {
    highestTemperature: 305,
    lowestTemperature: 285,
    timeOfHighestTemperature: 1633159200,
    mostCommonWeather: {
      main: 'Clouds',
      icon: '02d',
      description: 'few clouds',
    },
    weatherDetail: {
      1633159200: {
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
    },
  },
};

const renderComponent = (forecast = mockForecast) => {
  return render(
    <WeatherProvider>
      <DailyForecastTiles forecast={forecast} />
    </WeatherProvider>,
  );
};

describe('DailyForecastTiles', () => {
  test('renders correctly with forecast data', () => {
    renderComponent();
    expect(screen.queryByText('Fri')).toBeInTheDocument();
    expect(screen.queryByText('Sat')).toBeInTheDocument();
  });
});
