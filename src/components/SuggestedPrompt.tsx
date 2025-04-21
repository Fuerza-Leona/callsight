import React from 'react';

type Props = {
  title: string;
  onClick?: () => void;
};

const SuggestedPrompt = ({ title, onClick }: Props) => {
  return (
    <div
      className="border border-gray-400 w-full px-5 py-18 text-center rounded-3xl text-2xl hover:bg-[#F6CF3C] hover:transition-colors hover:cursor-pointer"
      onClick={onClick}
    >
      {title}
    </div>
  );
};

export default SuggestedPrompt;
