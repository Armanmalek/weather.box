import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CurrentWeatherView } from './CurrentWeatherView';
import { WeatherDetail } from '../models/weather';
import { WeatherProvider } from '../context/weatherContext';

const mockWeatherDetail: WeatherDetail = {
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

const renderComponent = (data: WeatherDetail) => {
  return render(
    <WeatherProvider>
      <CurrentWeatherView data={data} />
    </WeatherProvider>,
  );
};

describe('CurrentWeatherView', () => {
  test('renders weather rain details if rain is present', () => {
    renderComponent(mockWeatherDetail);

    expect(screen.getByText('Rain')).toBeInTheDocument();
    expect(screen.getByText('04:00 PM')).toBeInTheDocument();
    expect(screen.getByText('light rain')).toBeInTheDocument();
    expect(screen.queryByText('Wind: 25 km/h')).not.toBeInTheDocument();
  });

  test('renders weather details if rain is not present', () => {
    const weatherData = { ...mockWeatherDetail, rain: undefined };
    renderComponent(weatherData);

    expect(screen.getByText('Pressure: 1013 hPa')).toBeInTheDocument();
    expect(screen.getByText('Humidity: 96%')).toBeInTheDocument();
    expect(screen.getByText('Wind: 25 km/h')).toBeInTheDocument();
    expect(screen.queryByText('Rain:')).not.toBeInTheDocument();
  });

  test('renders temperature unit buttons and changes unit on click', () => {
    renderComponent(mockWeatherDetail);

    const celsiusButton = screen.getByText('C');
    const fahrenheitButton = screen.getByText('F');

    expect(celsiusButton).toBeInTheDocument();
    expect(fahrenheitButton).toBeInTheDocument();

    fireEvent.click(fahrenheitButton);
    expect(fahrenheitButton).toHaveClass('font-bold bg-blue-200');
    expect(celsiusButton).not.toHaveClass('font-bold bg-blue-200');

    fireEvent.click(celsiusButton);
    expect(celsiusButton).toHaveClass('font-bold bg-blue-200');
    expect(fahrenheitButton).not.toHaveClass('font-bold bg-blue-200');
  });
});
