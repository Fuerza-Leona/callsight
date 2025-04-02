import { useState, useEffect } from 'react';
import axios from "axios";
import FileUploader from "./FileUploader";
import { fetchCompanies } from '../hooks/fetchCompanies';
import { useParticipants } from '../hooks/fetchParticipants';

interface FormInputsProps {
  onFormSubmit: (data: { cliente: string; participantes: string[]; fecha: string; file: File | null }) => void;
}

const FormInputs: React.FC<FormInputsProps> = ({ onFormSubmit }) => {
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
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

  const { companies, loading: companiesLoading, error: companiesError } = fetchCompanies(token);
  const { participants, loading: participantsLoading, error: participantsError } = useParticipants(selectedCompany, token);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleParticipantClick = (userId: string) => {
    setSelectedParticipants((prev) => 
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const removeParticipant = (userId: string) => {
    setSelectedParticipants((prev) => prev.filter((id) => id !== userId));
  };

  const handleSubmit = () => {
    onFormSubmit({
      cliente: selectedCompany,
      participantes: selectedParticipants,
      fecha: date,
      file: selectedFile,
    });
  };

  return (
    <div className="flex justify-center">
      <form className="w-full max-w-md flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md">
        <FileUploader onFileSelect={handleFileSelect} />

        <div className="flex flex-col">
          <label className="font-semibold mb-1">Empresa</label>
          <select
            className="w-full p-3 bg-gray-200 rounded-lg"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="">Seleccionar cliente</option>
            {companiesLoading || !token ? (
              <option value="" disabled>Cargando empresas...</option>
            ) : companiesError ? (
              <option value="" disabled>Error cargando empresas</option>
            ) : companies?.length > 0 ? (
              companies.map((company) => (
                <option key={company.company_id} value={company.company_id}>
                  {company.name}
                </option>
              ))
            ) : (
              <option value="" disabled>No hay empresas disponibles</option>
            )}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1">Participantes</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedParticipants.map((userId) => {
              const participant = participants.find((p) => p.user_id === userId);
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
                  className={`px-3 py-1 rounded-full cursor-pointer ${selectedParticipants.includes(participant.user_id) ? 'bg-[#13202a] text-white' : 'bg-gray-200'}`}
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
            className="w-full p-3 bg-gray-200 rounded-lg"
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