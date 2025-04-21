import { useState, useEffect } from 'react';
import axios from 'axios';
import FileUploader from './FileUploader';
import { useFetchCompanies } from '@/hooks/fetchCompanies';
import { useParticipants } from '@/hooks/fetchParticipants';
import SearchBar from './SearchBar';
import { apiUrl } from '@/constants';

interface FormInputsProps {
  onFormSubmit: (data: {
    cliente: string;
    participantes: string[];
    fecha: string;
    file: File | null;
  }) => void;
}

const FormInputs: React.FC<FormInputsProps> = ({}) => {
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );
  const [date, setDate] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await axios.get('/api/token');
        setToken(response.data.access_token);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    getToken();
  }, []);

  const {
    companies,
    loading: companiesLoading,
    error: companiesError,
  } = useFetchCompanies(token);
  const {
    participants,
    loading: participantsLoading,
    error: participantsError,
  } = useParticipants(selectedCompany, token);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleParticipantClick = (userId: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const removeParticipant = (userId: string) => {
    setSelectedParticipants((prev) => prev.filter((id) => id !== userId));
  };

  const handleSubmit = async () => {
    if (!selectedCompany || !date || !selectedFile) {
      alert('Por favor, completa todos los campos antes de analizar.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('date_string', `${date} 00:00`);
    formData.append('company_id', selectedCompany);
    formData.append('participants', selectedParticipants.join(','));

    try {
      const response = await axios.post(
        `${apiUrl}/ai/alternative-analysis`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Response:', response.data);
      alert('Análisis completado con éxito.');
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      alert('Ocurrió un error al procesar el análisis.');
    }
  };

  return (
    <div className="flex justify-center">
      <form className="w-full max-w-md flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md">
        <FileUploader onFileSelect={handleFileSelect} />

        <div className="flex flex-col">
          <label className="font-semibold mb-1">Empresa</label>
          <SearchBar
            label="Buscar Cliente"
            options={
              companiesLoading
                ? [{ label: 'Cargando empresas...' }]
                : companiesError
                  ? [{ label: 'Error cargando empresas' }]
                  : companies.map((row) => ({ label: row.name }))
            }
            onSelect={(e) => setSelectedCompany(e!)}
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1">Participantes</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedParticipants.map((userId) => {
              const participant = participants.find(
                (p) => p.user_id === userId
              );
              return (
                <span
                  key={userId}
                  className="bg-[#0f1a22] text-white px-3 py-1 rounded-full cursor-pointer"
                  onClick={() => removeParticipant(userId)}
                >
                  {participant?.username} ✕
                </span>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2">
            {!selectedCompany ? (
              <p>Seleccione una empresa primero</p>
            ) : participantsLoading ? (
              <p>Cargando participantes...</p>
            ) : participantsError ? (
              <p>Error cargando participantes</p>
            ) : participants.length === 0 ? (
              <p>No hay participantes disponibles</p>
            ) : (
              participants.map((participant) => (
                <span
                  key={participant.user_id}
                  className={`px-3 py-1 rounded-full cursor-pointer ${
                    selectedParticipants.includes(participant.user_id)
                      ? 'bg-[#13202a] text-white'
                      : 'bg-gray-200'
                  }`}
                  onClick={() => handleParticipantClick(participant.user_id)}
                >
                  {participant.username}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1">Fecha</label>
          <input
            type="date"
            className="w-full p-3 bg-gray-200 rounded-lg border-black"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full p-3 bg-[#13202a]  text-white rounded-lg hover:bg-blue-600 transition"
        >
          Analizar
        </button>
      </form>
    </div>
  );
};

export default FormInputs;
