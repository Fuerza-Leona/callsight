import React from 'react';

type Props = {
  title: string;
  onClick?: () => void;
};

const SuggestedPrompt = ({ title, onClick }: Props) => {
  return (
    <div
      className="border border-gray-400 w-full px-5 h-[12rem] text-center rounded-3xl text-xl hover:bg-[#F6CF3C] hover:transition-colors hover:cursor-pointer flex justify-center items-center"
      onClick={onClick}
    >
      {title}
    </div>
  );
};

export default SuggestedPrompt;
