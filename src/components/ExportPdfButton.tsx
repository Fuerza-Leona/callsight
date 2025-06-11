import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface ExportPdfButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function ExportPdfButton({
  onClick,
  isLoading,
  disabled = false,
}: ExportPdfButtonProps) {
  return (
    <button
      className="text-[#FFFFFF] rounded-md p-2 mx-1 w-full gap-2 cursor-pointer flex items-center justify-center"
      style={{ backgroundColor: '#6564DB' }}
      onClick={onClick}
      disabled={isLoading || disabled}
    >
      <FileDownloadIcon className="mr-2" />
      {isLoading ? 'Exportando...' : 'Exportar como PDF'}
    </button>
  );
}
