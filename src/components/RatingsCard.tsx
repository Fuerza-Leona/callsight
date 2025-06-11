import {
  Box,
  CircularProgress,
  Tooltip,
  Typography,
  LinearProgress,
  styled,
} from '@mui/material';
import { Info } from '@mui/icons-material';

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.MuiLinearProgress-colorPrimary`]: {
    backgroundColor: theme.palette.grey[200],
  },
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main,
  },
}));

interface Rating {
  rating: number;
  count: number;
}

interface RatingsCardProps {
  title: string;
  tooltipText: string;
  loading: boolean;
  error: boolean;
  ratings: Rating[] | null | undefined;
  maxRating?: number;
  emptyMessage?: string;
  errorMessage?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function RatingsCard({
  title,
  tooltipText,
  loading,
  error,
  ratings,
  maxRating = 5,
  emptyMessage = 'No hay evaluaciones disponibles',
  errorMessage = 'Error al cargar las evaluaciones',
  className = '',
  style = { minHeight: '300px' },
}: RatingsCardProps) {
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

    if (!ratings) {
      return <p style={{ textAlign: 'left' }}>{emptyMessage}</p>;
    }

    const allRatings = Array.from({ length: maxRating }, (_, index) => {
      const ratingValue = index + 1;
      const existingRating = ratings.find((r) => r.rating === ratingValue);
      return {
        rating: ratingValue,
        count: existingRating ? existingRating.count : 0,
      };
    });

    const totalCount = allRatings.reduce(
      (sum, rating) => sum + rating.count,
      0
    );

    return allRatings.map((rating) => (
      <Box
        key={rating.rating}
        sx={{ my: 1, display: 'flex', alignItems: 'center' }}
      >
        <Typography
          sx={{ width: 140, mr: 2 }}
          variant="body1"
          className="text-left"
        >
          {Array(rating.rating).fill('★').join('')}
        </Typography>
        <Box sx={{ width: '100%', mt: 1, mr: 2 }}>
          <StyledLinearProgress
            variant="determinate"
            value={totalCount > 0 ? (rating.count / totalCount) * 100 : 0}
          />
        </Box>
        <Typography variant="body1" sx={{ fontWeight: 'bold', minWidth: 30 }}>
          {rating.count}
        </Typography>
      </Box>
    ));
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
