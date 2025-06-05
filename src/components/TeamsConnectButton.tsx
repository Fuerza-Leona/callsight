import React from 'react';
import { useTeamsConnect } from '../hooks/useTeamsConnect';

const TeamsConnectButton: React.FC = () => {
  const { connectTeams, loading, error, data } = useTeamsConnect();

  const handleConnect = async (): Promise<void> => {
    try {
      await connectTeams();
      // The hook will automatically redirect to auth_url
    } catch (error) {
      console.error('Failed to connect to Teams:', error);
    }
  };

  return (
    <div>
      <button
        onClick={handleConnect}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        type="button"
      >
        {loading ? 'Connecting...' : 'Connect to Microsoft Teams'}
      </button>

      {error && <div className="text-red-500 mt-2">Error: {error}</div>}

      {data && (
        <div className="text-green-500 mt-2">
          Redirecting to Microsoft Teams...
        </div>
      )}
    </div>
  );
};

export default TeamsConnectButton;
