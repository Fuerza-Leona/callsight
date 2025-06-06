import { useState } from 'react';
import FileUploader from './FileUploader';
import { useFetchCompanies } from '@/hooks/fetchCompanies';
import { useParticipants } from '@/hooks/fetchParticipants';
import SearchBar from './SearchBar';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';

interface FormInputsProps {
  onFormSubmit: (data: {
    cliente: string;
    participantes: string[];
    fecha: string;
    file: File | null;
  }) => void;
}

const FormInputs: React.FC<FormInputsProps> = ({}) => {
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );
  const [date, setDate] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    companies,
    loading: companiesLoading,
    error: companiesError,
  } = useFetchCompanies();
  const {
    participants,
    loading: participantsLoading,
    error: participantsError,
  } = useParticipants(selectedCompany);

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
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);
    setSuccess(false);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('date_string', `${date} 12:00:00`);
    formData.append('company_id', selectedCompany);
    formData.append('participants', selectedParticipants.join(','));

    try {
      const response = await api.post('/ai/alternative-analysis', formData);
      console.log('Response:', response.data);

      setSuccess(true);

      const callId = response.data.conversation_id;
      if (callId) {
        router.push(`/calls/detail?call_id=${callId}`);
      } else {
        setError('No se recibió ID de conversación en la respuesta');
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      setError(
        'Ha ocurrido un error al procesar la llamada. Por favor intente nuevamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md relative min-h-[600px]">
        <div className="p-6 h-full">
          <div
            className={`flex flex-col gap-4 h-full ${isSubmitting || success || error ? 'opacity-5' : ''}`}
          >
            <FileUploader onFileSelect={handleFileSelect} />

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Empresa</label>
              <SearchBar
                placeholder="Buscar empresa"
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
                      {participant?.username}
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
                  participants.map((participant, index) => (
                    <span
                      id={`participant_${index}`}
                      key={participant.user_id}
                      className={`px-3 py-1 rounded-full cursor-pointer ${
                        selectedParticipants.includes(participant.user_id)
                          ? 'bg-[#13202a] text-white'
                          : 'bg-gray-200'
                      }`}
                      onClick={() =>
                        handleParticipantClick(participant.user_id)
                      }
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
                id="dateinput"
              />
            </div>

            <button
              id="submit-button"
              type="button"
              onClick={handleSubmit}
              className="w-full p-3 bg-[#13202a] cursor-pointer text-white rounded-lg hover:bg-blue-600 transition mt-auto"
            >
              Analizar
            </button>
          </div>

          {isSubmitting && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50">
              <div
                className="w-16 h-16 border-4 border-gray-300 border-t-[#13202a] rounded-full animate-spin"
                id="loading"
              ></div>
              <p className="mt-4 text-center font-medium">
                Procesando llamada...
              </p>
            </div>
          )}

          {success && !isSubmitting && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="mt-4 text-center font-medium">
                ¡Análisis completado con éxito!
              </p>
              <p className="mt-2 text-center text-sm text-gray-600">
                Abriendo detalles...
              </p>
            </div>
          )}

          {error && !isSubmitting && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="mt-4 text-center font-medium">Error</p>
              <p className="mt-2 text-center text-sm text-gray-600">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-4 px-4 py-2 bg-[#13202a] text-white rounded-lg hover:bg-blue-600 transition"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormInputs;
