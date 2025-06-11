import MultipleSelectChip from '@/components/MultipleSelectChip';

interface FilterItem {
  id: string;
  name: string;
}

interface FilterProps {
  id: string;
  title: string;
  description: string;
  loading: boolean;
  error: boolean;
  items: FilterItem[];
  selectedValues: string[];
  onChange: (newValues: string[]) => void;
  className?: string;
}

export default function Filter({
  id,
  title,
  description,
  loading,
  error,
  items,
  selectedValues,
  onChange,
  className = '',
}: FilterProps) {
  const getTitle = () => {
    if (loading) return `${title} (Cargando...)`;
    if (error) return `${title} (Error)`;
    return title;
  };

  const getNames = () => {
    if (loading || error || !items) {
      return [];
    }
    return items;
  };

  return (
    <div className={className}>
      <MultipleSelectChip
        id={id}
        title={getTitle()}
        names={getNames()}
        value={selectedValues}
        onChange={onChange}
      />
      <small className="text-gray-500 text-left block px-4 mt-1 mb-2">
        {description}
      </small>
    </div>
  );
}
