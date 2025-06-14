import { ReactNode } from 'react';

interface ColumnProps {
  children: ReactNode;
  width?: 'sidebar' | 'full' | 'auto';
  alignment?: 'left' | 'center' | 'right';
  gap?: string;
  className?: string;
}

export default function Column({
  children,
  width = 'auto',
  alignment = 'center',
  gap = '2',
  className = '',
}: ColumnProps) {
  const getWidthClasses = () => {
    switch (width) {
      case 'sidebar':
        return 'w-auto md:w-80 lg:w-96'; // Fixed sidebar width
      case 'full':
        return 'w-full lg:w-[100%] md:w-[80%]'; // Main content width
      default:
        return 'w-auto';
    }
  };

  const getAlignmentClasses = () => {
    switch (alignment) {
      case 'left':
        return 'items-start text-left';
      case 'right':
        return 'items-end text-right';
      default:
        return 'items-center text-center';
    }
  };

  return (
    <div
      className={`flex flex-col ${getWidthClasses()} ${getAlignmentClasses()} gap-${gap} ${className}`}
    >
      {children}
    </div>
  );
}
