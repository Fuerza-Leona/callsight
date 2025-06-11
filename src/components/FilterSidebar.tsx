import dayjs from 'dayjs';
import { useUser } from '@/context/UserContext';
import Calendar from '@/components/Calendar';
import Filter from '@/components/Filter';
import Column from '@/components/Column';
import { Agent } from '@/hooks/fetchAgents';
import { Company } from '@/hooks/fetchDashboardCompanies';
import { Client } from '@/hooks/fetchClients';

interface FilterSidebarProps {
  // Calendar props
  selectedDate: dayjs.Dayjs;
  onDateChange: (newDate: dayjs.Dayjs | null) => void;
  calendarViews?: ('month' | 'day')[];

  // Agents filter props
  agents?: Agent[];
  loadingAgents?: boolean;
  errorAgents?: boolean;
  selectedAgents: string[];
  onAgentsChange: (newAgents: string[]) => void;

  // Companies filter props
  companies?: Company[];
  loadingCompanies?: boolean;
  errorCompanies?: boolean;
  selectedCompanies: string[];
  onCompaniesChange: (newCompanies: string[]) => void;

  // Clients filter props
  clients?: Client[];
  loadingClients?: boolean;
  errorClients?: boolean;
  selectedClients: string[];
  onClientsChange: (newClients: string[]) => void;

  // Optional customization
  showAgentsFilter?: boolean;
  showCompaniesFilter?: boolean;
  showClientsFilter?: boolean;
}

export default function FilterSidebar({
  selectedDate,
  onDateChange,
  calendarViews = ['month', 'day'],
  agents,
  loadingAgents = false,
  errorAgents = false,
  selectedAgents,
  onAgentsChange,
  companies,
  loadingCompanies = false,
  errorCompanies = false,
  selectedCompanies,
  onCompaniesChange,
  clients,
  loadingClients = false,
  errorClients = false,
  selectedClients,
  onClientsChange,
  showAgentsFilter = true,
  showCompaniesFilter = true,
  showClientsFilter = true,
}: FilterSidebarProps) {
  const { user } = useUser();

  return (
    <Column width="sidebar" alignment="center" gap="2">
      <Calendar
        value={selectedDate}
        onChange={onDateChange}
        views={calendarViews}
      />

      {user?.role === 'admin' && showAgentsFilter && (
        <Filter
          id="agents"
          title="Agentes"
          description="Personal que atiende la llamada"
          loading={loadingAgents}
          error={errorAgents}
          items={
            agents?.map((agent: Agent) => ({
              id: agent.user_id,
              name: agent.username,
            })) || []
          }
          selectedValues={selectedAgents}
          onChange={onAgentsChange}
        />
      )}

      {showCompaniesFilter && (
        <Filter
          id="companies"
          title="Empresas"
          description="Organizaciones a las que se le brinda soporte"
          loading={loadingCompanies}
          error={errorCompanies}
          items={
            companies?.map((company: Company) => ({
              id: company.company_id,
              name: company.name,
            })) || []
          }
          selectedValues={selectedCompanies}
          onChange={onCompaniesChange}
        />
      )}

      {showClientsFilter && (
        <Filter
          id="clients"
          title="Clientes"
          description="Usuarios de la empresa que reciben soporte"
          loading={loadingClients}
          error={errorClients}
          items={
            clients?.map((client: Client) => ({
              id: client.user_id,
              name: client.username,
            })) || []
          }
          selectedValues={selectedClients}
          onChange={onClientsChange}
        />
      )}
    </Column>
  );
}
