// // app/weather/[cityId]/page.tsx

// interface WeatherData {
//   name: string;
//   weather: { description: string; icon: string }[];
//   main: {
//     temp: number;
//     feels_like: number;
//     temp_min: number;
//     temp_max: number;
//     pressure: number;
//     humidity: number;
//   };
//   // Add other fields as needed
// }

// interface PageProps {
//   params: { cityID: string };
// }

// export default async function WeatherPage({ params }: PageProps) {
//   console.log('params', params);
//   const { cityID } = params;
//   const apiKey = process.env.APP_ID;
//   console.log('erere', apiKey);
//   if (!apiKey) {
//     throw new Error('Missing OPEN_WEATHER_APPID environment variable');
//   }

//   // Fetch the current weather data on the server
//   const res = await fetch(
//     `http://api.openweathermap.org/data/2.5/weather?id=${cityID}&appid=${apiKey}`,
//     {
//       next: { revalidate: 60 }, // Optional: revalidate every 60 seconds
//     },
//   );
//   console.log('res', res);

//   if (!res.ok) {
//     // In production, you might want to render an error component instead
//     throw new Error('Failed to fetch weather data');
//   }

//   const data: WeatherData = await res.json();

//   console.log('data', data);
//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Weather for {data.name}</h2>
//       <div className="p-2 text-black border border-gray-300 rounded">
//         <p>
//           <strong>Temperature:</strong> {data.main.temp} K
//         </p>
//         <p>
//           <strong>Feels Like:</strong> {data.main.feels_like} K
//         </p>
//         <p>
//           <strong>Condition:</strong> {data.weather[0].description}
//         </p>
//       </div>
//     </div>
//   );
// }
// 'use client';
// import { getForecast } from '@/app/controllers/weatherController';
// import { CurrentWeatherView } from '../../components/CurrentWeatherView';
// import { WeatherDetail } from '@/app/models/weather';
// import { ExtendedForecast } from '@/app/models/forecast';
// import { ForecastGraph } from '@/app/components/ForecastGraph';
// import React, { useState } from 'react';

// interface PageProps {
//   params: { cityID: string };
// }

// const ET_OFFSET = 18000000;

// export default async function WeatherPage({ params }: PageProps) {
//   const {
//     extendedForecast,
//     todaysForecast,
//   }: {
//     extendedForecast: ExtendedForecast | null;
//     todaysForecast: WeatherDetail | null;
//   } = await getForecast(params.cityID);

//   const unixTime = new Date().getTime() - ET_OFFSET;
//   const day = new Date(unixTime).toISOString().split('T')[0];
//   console.log('erereerer', new Date(unixTime).toISOString().split('T')[0]);
//   console.log('eerere', extendedForecast);

//   const [day, setDay] = useState<WeatherDetail | null>(null);

//   return (
//     <div className="container mx-auto p-4">
//       {todaysForecast !== null ? (
//         <CurrentWeatherView data={todaysForecast} />
//       ) : null}
//       {/* {extendedForecast !== null ? (
//         <ForecastGraph forecast={extendedForecast} />
//       ) : null} */}
//     </div>
//   );
// }

// app/weather/[cityId]/page.tsx
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
  const { extendedForecast, todaysForecast } = await getForecast(cityID);

  // Pass the fetched data down to the client component.
  return (
    <WeatherProvider>
      <div className="container mx-auto p-4">
        <WeatherDashboard
          extendedForecast={extendedForecast}
          todaysForecast={todaysForecast}
        />
      </div>
    </WeatherProvider>
  );
}
