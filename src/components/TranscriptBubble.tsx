import React from 'react';

interface TranscriptBubbleProps {
  color?: 'pink' | 'yellow' | 'blue';
  user?: 'me' | 'you';
  message: string;
}

const TranscriptBubble: React.FC<TranscriptBubbleProps> = ({
  color,
  user,
  message,
}) => {
  const bgColor =
    color === 'pink'
      ? 'bg-[#F294CD]'
      : color === 'yellow'
        ? 'bg-[#F6CF3C]'
        : color === 'blue'
          ? 'bg-[#13202A] text-white'
          : '';

  const margin =
    user === 'me' ? 'ml-10 mr-0' : user === 'you' ? 'mr-12 ml-auto' : '';

  return (
    <div className="w-full mt-3">
      <div
        className={`w-[calc(45%)] min-w-40 p-4 rounded-lg ${bgColor} ${margin}`}
      >
        {message}
      </div>
    </div>
  );
};

export default TranscriptBubble;
