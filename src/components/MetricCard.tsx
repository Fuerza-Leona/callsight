import { CircularProgress } from '@mui/material';

interface MetricCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  loading: boolean;
  error: boolean;
  id?: string;
  className?: string;
}

export default function MetricCard({
  title,
  value,
  suffix,
  loading,
  error,
  id,
  className = '',
}: MetricCardProps) {
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-left w-full">
          <CircularProgress size={40} />
        </div>
      );
    }

    if (error) {
      return <span className="text-2xl text-red-500">Error</span>;
    }

    return (
      <div id={id}>
        {value}
        {suffix && <span className="text-sm pl-2 font-light">{suffix}</span>}
      </div>
    );
  };

  return (
    <div
      className={`w-[100%] rounded-md flex flex-col items-left justify-left gap-3 p-3 shadow-md ${className}`}
      style={{ backgroundColor: 'white', height: '110px' }}
    >
      <div className="flex gap-2 text-md items-left font-bold">
        <h1>{title}</h1>
      </div>
      <div className="text-5xl font-bold flex justify-left items-left h-16 flex-grow">
        {renderContent()}
      </div>
    </div>
  );
}
