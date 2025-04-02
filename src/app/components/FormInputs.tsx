import { useState } from 'react';
import { fetchCompanies } from '../hooks/fetchCompanies'; // Import the updated function
import { fetchParticipants } from '../hooks/fetchParticipants'; // Import the updated function

interface FormInputsProps {
  onFormSubmit: (data: { cliente: string; participantes: string[]; fecha: string }) => void;
}

const FormInputs: React.FC<FormInputsProps> = ({ onFormSubmit }) => {
  // State variables
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [date, setDate] = useState<string>('');

  // Use the updated functions
  const { companies, loading: companiesLoading, error: companiesError } = fetchCompanies();
  const { participants, loading: participantsLoading, error: participantsError } = fetchParticipants(selectedCompany);

  /**
   * Handles form submission and sends selected data to the parent component
   */
  const handleSubmit = () => {
    onFormSubmit({
      cliente: selectedCompany,
      participantes: selectedParticipants,
      fecha: date,
    });
  };

  return (
    <div className="flex flex-col ">
      <form className="w-1/3 flex flex-col gap-4">
        {/* Company Input */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Cliente</label>
          <select
            className="w-full p-3 bg-gray-200 rounded-lg"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="">Seleccionar cliente</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        {/* Participants Input */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Participantes</label>
          {participantsLoading && <p>Cargando participantes...</p>}
          <select
            multiple
            className="w-full p-3 bg-gray-200 rounded-lg"
            value={selectedParticipants}
            onChange={(e) =>
              setSelectedParticipants(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            disabled={participantsLoading}
          >
            <option value="">Seleccionar participantes</option>
            {participants.map((participant) => (
              <option key={participant.id} value={participant.id}>
                {participant.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Input */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Fecha</label>
          <input
            type="date"
            className="w-full p-3 bg-gray-200 rounded-lg"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button type="button" onClick={handleSubmit} className="hidden">
          Upload
        </button>
      </form>
    </div>
  );
};

export default FormInputs;
