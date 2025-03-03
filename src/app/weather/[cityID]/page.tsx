import React from 'react';
import { getForecast } from '@/app/controllers/weatherController';
import WeatherDashboard from '@/app/components/WeatherDashboard';
import { WeatherProvider } from '@/app/context/weatherContext';

export default async function WeatherPage({
  params,
}: {
  params: Promise<{ cityID: string }>;
}) {
  const cityID = (await params).cityID;
  const { extendedForecast, todaysForecast, name } = await getForecast(cityID);

  return (
    <WeatherProvider>
      <div className="container mx-auto p-4">
        <WeatherDashboard
          name={name}
          extendedForecast={extendedForecast}
          todaysForecast={todaysForecast}
        />
      </div>
    </WeatherProvider>
  );
}
