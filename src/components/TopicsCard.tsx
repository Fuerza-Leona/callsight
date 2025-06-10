import { Box, CircularProgress, Tooltip } from '@mui/material';
import { Info } from '@mui/icons-material';
import SimpleWordCloud from '@/components/SimpleWordCloud';

interface Topic {
  topic: string;
  amount: number;
}

interface TopicsCardProps {
  title: string;
  tooltipText: string;
  loading: boolean;
  error: boolean;
  topics: Topic[] | null;
  maxWords?: number;
  emptyMessage?: string;
  errorMessage?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function TopicsCard({
  title,
  tooltipText,
  loading,
  error,
  topics,
  maxWords = 15,
  emptyMessage = 'No hay temas principales',
  errorMessage = 'Error al cargar los temas principales',
  className = '',
  style = { minHeight: '260px' },
}: TopicsCardProps) {
  const renderContent = () => {
    if (loading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="150px"
        >
          <CircularProgress size={60} />
        </Box>
      );
    }

    if (error) {
      return (
        <p style={{ textAlign: 'left' }} className="mt-3">
          {errorMessage}
        </p>
      );
    }

    if (!topics || topics.length === 0) {
      return (
        <p style={{ textAlign: 'left' }} className="mt-3">
          {emptyMessage}
        </p>
      );
    }

    return (
      <SimpleWordCloud
        words={topics.map((topic) => ({
          text: topic.topic,
          value: topic.amount,
        }))}
        maxWords={maxWords}
      />
    );
  };

  return (
    <div
      className={`w-full shadow-md rounded-md bg-white p-5 ${className}`}
      style={style}
    >
      <div className="flex gap-2 items-center">
        <h1 className="text-lg font-bold">{title}</h1>
        <Tooltip
          title={tooltipText}
          placement="top"
          slotProps={{
            tooltip: {
              sx: {
                fontSize: '16px',
                maxWidth: '300px',
              },
            },
          }}
        >
          <Info sx={{ fontSize: 20, color: '#666', cursor: 'help' }} />
        </Tooltip>
      </div>

      <Box
        sx={{
          width: '100%',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'left',
        }}
      >
        {renderContent()}
      </Box>
    </div>
  );
}
