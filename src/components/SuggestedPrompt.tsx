import React from 'react';

type Props = {
  title: string;
  id: string;
  onClick?: () => void;
};

const SuggestedPrompt = ({ title, id, onClick }: Props) => {
  return (
    <div
      className="border border-gray-400 w-full px-5 h-[12rem] text-center rounded-3xl text-xl hover:bg-[#F6CF3C] hover:transition-colors hover:cursor-pointer flex justify-center items-center"
      onClick={onClick}
      id={id}
    >
      {title}
    </div>
  );
};

export default SuggestedPrompt;
