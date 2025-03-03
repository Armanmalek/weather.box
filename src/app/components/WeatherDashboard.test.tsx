import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WeatherDashboard from './WeatherDashboard';
import { WeatherProvider } from '../context/weatherContext';
import { ExtendedForecast } from '@/app/models/forecast';
import { WeatherDetail } from '../models/weather';

const mockTodaysForecast: WeatherDetail = {
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
jest.mock('./ForecastGraph', () => {
  const MockForecastGraph = () => <div data-testid="forecast-graph" />;
  MockForecastGraph.displayName = 'MockForecastGraph';
  return MockForecastGraph;
});

const renderComponent = (
  todaysForecast: WeatherDetail | null,
  extendedForecast: ExtendedForecast | null,
) => {
  return render(
    <WeatherProvider>
      <WeatherDashboard
        todaysForecast={todaysForecast}
        extendedForecast={extendedForecast}
      />
    </WeatherProvider>,
  );
};

describe('WeatherDashboard', () => {
  test('renders CurrentWeatherView when todaysForecast is provided', () => {
    renderComponent(mockTodaysForecast, null);

    expect(screen.getByText('Feels Like:')).toBeInTheDocument();
  });

  test('does not render ForecastGraph or DailyForecastTile when extendedForecast is not provided', () => {
    renderComponent(mockTodaysForecast, null);
    expect(screen.queryByText('Temperature')).not.toBeInTheDocument();
  });
});
