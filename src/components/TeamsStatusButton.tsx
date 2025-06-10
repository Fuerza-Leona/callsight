import Image from 'next/image';

interface TeamsStatusButtonProps {
  isLoading: boolean;
  meetings: number | string | null;
}

export default function TeamsStatusButton({
  isLoading,
  meetings,
}: TeamsStatusButtonProps) {
  const getStatusText = () => {
    if (isLoading) {
      return 'Cargando llamadas de Teams...';
    }

    if (typeof meetings === 'number') {
      return meetings > 0
        ? `${meetings} nuevas llamadas de Teams`
        : 'Sin llamadas nuevas de Teams';
    }

    return 'Error en Teams';
  };

  return (
    <button
      className="text-color rounded-md p-2 w-full flex items-center gap-2"
      style={{
        backgroundColor: isLoading ? '#f5f5f5' : 'white',
        color: isLoading ? '#9ca3af' : 'inherit',
        width: '285px',
      }}
    >
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Microsoft_Office_Teams_%282018–present%29.svg/2203px-Microsoft_Office_Teams_%282018–present%29.svg.png"
        width={20}
        height={20}
        alt="Teams Logo"
        className={`w-5 h-5 mx-1 ${isLoading ? 'opacity-50' : ''}`}
      />
      {getStatusText()}
    </button>
  );
}
