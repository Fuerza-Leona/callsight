import { ReactNode } from 'react';

interface RowProps {
  columns: number;
  children: ReactNode;
  gap?: string;
  className?: string;
}

export default function Row({
  columns,
  children,
  gap = '4',
  className = '',
}: RowProps) {
  const getGridCols = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1';
    }
  };

  return (
    <div className={`grid ${getGridCols()} gap-${gap} w-full ${className}`}>
      {children}
    </div>
  );
}
