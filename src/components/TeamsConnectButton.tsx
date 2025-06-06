'use client';
import React, { useEffect, useState } from 'react';
import { useTeamsConnect } from '../hooks/useTeamsConnect';
import { useRouter } from 'next/navigation';

interface TeamsConnectButtonProps {
  onSkip?: () => void;
}

const TeamsConnectButton: React.FC<TeamsConnectButtonProps> = ({ onSkip }) => {
  const { connectTeams, loading, error, data } = useTeamsConnect();
  const router = useRouter();
  const [clicked, setClicked] = useState(false);

  const handleConnect = (): void => {
    setClicked(true);
    connectTeams();
  };

  useEffect(() => {
    if (data) {
      router.push(data);
    }
  }, [data, router]);

  useEffect(() => {
    if (error) {
      console.error('Failed to connect to Teams: ', error);
      setClicked(false); // Permitir volver a intentar
    }
  }, [error]);

  const isLoading = clicked || loading;

  return (
    <div className="flex flex-col gap-4 items-center">
      <button
        onClick={handleConnect}
        disabled={isLoading}
        className="flex items-center justify-center gap-3 bg-[#0078d4] text-white font-semibold py-3 px-6 rounded-md hover:bg-[#0066b8] transition disabled:opacity-50"
        type="button"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 23 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1H11V11H1V1Z" fill="#F25022" />
          <path d="M12 1H22V11H12V1Z" fill="#7FBA00" />
          <path d="M1 12H11V22H1V12Z" fill="#00A4EF" />
          <path d="M12 12H22V22H12V12Z" fill="#FFB900" />
        </svg>
        {isLoading ? 'Conectando...' : 'Conectar con Teams'}
      </button>

      {error && <div className="text-red-500">Error: {error}</div>}

      {onSkip && (
        <button
          onClick={onSkip}
          className="bg-gray-500 text-white font-semibold py-3 px-6 rounded-md hover:bg-gray-600 transition"
          type="button"
        >
          Proceder sin conectar
        </button>
      )}
    </div>
  );
};

export default TeamsConnectButton;
