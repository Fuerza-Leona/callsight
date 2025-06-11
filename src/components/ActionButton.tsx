import Link from 'next/link';
import { ReactNode } from 'react';

interface ActionButtonProps {
  href: string;
  backgroundColor: string;
  icon: ReactNode;
  text: string;
  id?: string;
  className?: string;
}

export default function ActionButton({
  href,
  backgroundColor,
  icon,
  text,
  id,
  className = '',
}: ActionButtonProps) {
  return (
    <Link
      href={href}
      className={`text-[#FFFFFF] rounded-md block ${className}`}
      id={id}
    >
      <div
        className="p-2 mr-1 items-center justify-center text-center flex rounded-md"
        style={{ backgroundColor }}
      >
        {icon}
        <p className="pr-3">{text}</p>
      </div>
    </Link>
  );
}
