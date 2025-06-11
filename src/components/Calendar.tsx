import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

interface CalendarProps {
  value: dayjs.Dayjs;
  onChange: (newDate: dayjs.Dayjs | null) => void;
  views?: ('month' | 'day' | 'year')[];
  locale?: string;
  className?: string;
  backgroundColor?: string;
  selectedColor?: string;
  textColor?: string;
}

export default function Calendar({
  value,
  onChange,
  locale = 'es',
  className = '',
}: CalendarProps) {
  return (
    <div className={`text-white rounded-md mb-5 ${className}`}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
        <DateCalendar
          value={value}
          onChange={onChange}
          views={['month', 'day']}
          className="bg-[#1E242B] rounded-md w-1/1"
          sx={{
            color: 'white',
            '.MuiTypography-root': { color: 'white' },
            '.MuiPickersDay-root': { color: 'white' },
            '.MuiPickersDay-root.Mui-selected': {
              backgroundColor: '#6564DB',
              color: 'white',
            },
            '.MuiPickersCalendarHeader-label': { color: 'white' },
            '.MuiSvgIcon-root': { color: 'white' },
            '.MuiPickersArrowSwitcher-button': { color: 'white' },
            '.MuiPickersYear-root': { color: 'white' },
            '.MuiPickersMonth-root': { color: 'white' },
          }}
        />
      </LocalizationProvider>
    </div>
  );
}
