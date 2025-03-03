'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cities } from '../data/cities';

const HomePage: React.FC = () => {
  const router = useRouter();
  const [selectedCityId, setSelectedCityId] = useState<number>(cities[0].id);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCityId(parseInt(event.target.value, 10));
  };

  const handleQuery = () => {
    router.push(`/weather/${selectedCityId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        Let&apos;s Get The Weather Forecast!
      </h2>
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <select
          className="p-2 text-black border border-gray-300 rounded"
          value={selectedCityId}
          onChange={handleSelectChange}
        >
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name} ({city.country})
            </option>
          ))}
        </select>
        <button
          onClick={handleQuery}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Get Forecast
        </button>
      </div>
    </div>
  );
};

export default HomePage;
