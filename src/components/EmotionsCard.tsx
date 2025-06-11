import { Box, CircularProgress, Tooltip } from '@mui/material';
import { Info } from '@mui/icons-material';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { Emotions } from '@/interfaces/emotions';

interface EmotionsCardProps {
  title: string;
  tooltipText: string;
  loading: boolean;
  error: boolean;
  emotions: Emotions | undefined;
  emptyMessage?: string;
  errorMessage?: string;
  className?: string;
  style?: React.CSSProperties;
  colors?: string[];
  width?: number;
  height?: number;
}

export default function EmotionsCard({
  title,
  tooltipText,
  loading,
  error,
  emotions,
  emptyMessage = 'No hay información disponible',
  errorMessage = 'Error al cargar las emociones',
  className = '',
  style = { minHeight: '300px' },
  colors = ['#6564DB', '#F6CF3C', '#F294CD'],
  width = 350,
  height = 200,
}: EmotionsCardProps) {
  const renderContent = () => {
    if (loading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="200px"
        >
          <CircularProgress size={60} />
        </Box>
      );
    }

    if (error) {
      return <p style={{ textAlign: 'left' }}>{errorMessage}</p>;
    }

    if (!emotions || emotions.negative == null) {
      return <p style={{ textAlign: 'left' }}>{emptyMessage}</p>;
    }

    return (
      <PieChart
        series={[
          {
            arcLabel: (item) => `${Math.round(item.value * 100)}%`,
            data: [
              {
                id: 0,
                value: emotions.positive ?? 0,
                label: 'Positivo',
              },
              {
                id: 1,
                value: emotions.neutral ?? 0,
                label: 'Neutro',
              },
              {
                id: 2,
                value: emotions.negative ?? 0,
                label: 'Negativo',
              },
            ],
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fontWeight: 'bold',
            fontSize: '14px',
          },
        }}
        width={width}
        height={height}
        className="font-bold text-xl pt-5"
        colors={colors}
      />
    );
  };

  return (
    <div
      className={`h-full shadow-md rounded-md bg-white p-5 ${className}`}
      style={style}
    >
      <div className="flex gap-2 items-center mb-3">
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
          maxWidth: 600,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {renderContent()}
      </Box>
    </div>
  );
}
