import Image from 'next/image';

interface DailyForecastTileProps {
  day: string;
  minTemp: number;
  maxTemp: number;
  icon: string;
  onClick: () => void;
  isActive: boolean;
}

const DailyForecastTile: React.FC<DailyForecastTileProps> = ({
  day,
  minTemp,
  maxTemp,
  icon,
  onClick,
  isActive,
}) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-4 border rounded-lg flex flex-col items-center transition-colors ${
        isActive ? 'font-bold bg-blue-50' : ''
      }`}
    >
      <div className="text-lg">{day}</div>
      <Image
        src={icon}
        alt={day}
        width={8}
        height={8}
        className="w-12 h-12 my-2"
      />
      <div className="text-sm">
        <span className="font-bold">{Math.round(maxTemp)}°</span> /{' '}
        {Math.round(minTemp)}°
      </div>
    </div>
  );
};

export default DailyForecastTile;
