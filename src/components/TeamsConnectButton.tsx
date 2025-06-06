'use client';
import React, { useEffect, useState } from 'react';
import { useTeamsConnect } from '../hooks/useTeamsConnect';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
        className="flex items-center justify-center gap-3 bg-[white] cursor-pointer  text-black py-2 px-6 rounded-md  transition disabled:opacity-50"
        type="button"
      >
        <Image
          width={20}
          height={20}
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Microsoft_Office_Teams_%282018–present%29.svg/2203px-Microsoft_Office_Teams_%282018–present%29.svg.png"
          alt="Microsoft Teams logo"
        />

        {isLoading ? 'Conectando...' : 'Conectar con Teams'}
      </button>

      {error && <div className="text-red-500">Error: {error}</div>}

      {onSkip && (
        <button
          onClick={onSkip}
          className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-gray-600 transition"
          type="button"
        >
          Proceder sin conectar
        </button>
      )}
    </div>
  );
};

export default TeamsConnectButton;
