'use client';

import Image from 'next/image';
import React from 'react';

type MoodCardProps = {
  mood: string;
  description: string;
  imageUrl: string;
  voice: string;
  onClick: (mood: string, description: string, voice: string) => void;
};

const MoodCard = ({
  mood,
  description,
  imageUrl,
  voice,
  onClick,
}: MoodCardProps) => {
  return (
    <div
      onClick={() => onClick(mood, description, voice)}
      className="flex flex-col cursor-pointer min-w-[17rem] transition hover:scale-105 active:scale-100"
    >
      <Image
        className="rounded-xl object-cover"
        src={imageUrl}
        alt={mood}
        width={272} // 17rem
        height={144} // 9rem
      />
      <h3 className="font-semibold mt-2 text-lg">{mood}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {description}
      </p>
    </div>
  );
};

export default MoodCard;
