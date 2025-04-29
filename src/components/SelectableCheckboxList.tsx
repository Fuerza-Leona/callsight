'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { Typography } from '@mui/material';
import { UUID } from 'crypto';

export type ItemData = {
  id: number | string;
  label: string;
  daysOpen: number;
  text: string;
  status: 'open' | 'in_progress' | 'closed';
  assigned_to: UUID;
};

type Props = {
  items: ItemData[];
  onSelect?: (item: ItemData) => void;
};

export default function SelectableCheckboxList({ items, onSelect }: Props) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [checked, setChecked] = React.useState<(number | string)[]>([]);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    console.log('Selected item in list:', items[index]); // Debug selected item
    if (onSelect && items[index]) {
      onSelect(items[index]);
    }
  };

  const handleToggle = (id: number | string) => {
    const currentIndex = checked.indexOf(id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(id);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  // Debug props
  React.useEffect(() => {
    console.log('SelectableCheckboxList items:', items);
    console.log('onSelect function provided:', !!onSelect);
  }, [items, onSelect]);

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <List>
        {items.map((item, index) => {
          const labelId = `checkbox-list-label-${item.id}`;

          return (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={selectedIndex === index}
                onClick={() => handleSelect(index)}
                dense
                sx={{
                  '&.Mui-selected': {
                    bgcolor: '#F6CF3C',
                    '&:hover': {
                      bgcolor: '#F6C000',
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.includes(item.id)}
                    tabIndex={-1}
                    disableRipple
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(item.id);
                    }}
                    slotProps={{
                      input: {
                        'aria-labelledby': labelId,
                      },
                    }}
                    sx={{
                      color: '#4D4637',
                      '&.Mui-checked': {
                        color: '#4D4637',
                      },
                    }}
                  />
                </ListItemIcon>

                <ListItemText
                  id={labelId}
                  primary={
                    <div className="flex justify-between items-start w-full">
                      <div className="flex flex-col">
                        <Typography variant="caption" fontWeight={500}>
                          {`Abierto hace ${item.daysOpen} días`}
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={700}
                          component="div"
                        >
                          {item.label}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          component="div"
                        >
                          {item.text.length > 70
                            ? `${item.text.slice(0, 70)}…`
                            : item.text}
                        </Typography>
                      </div>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        component="div"
                      >
                        {`#${item.id}`}
                      </Typography>
                    </div>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
