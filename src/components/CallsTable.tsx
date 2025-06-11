import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import Tag from '@/components/Tag';
import { Conversation } from '@/hooks/fetchConversations';

interface CallsTableProps {
  conversations: Conversation[];
  loading: boolean;
  onCallClick: (callId: string) => void;
}

export default function CallsTable({
  conversations,
  loading,
  onCallClick,
}: CallsTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center w-full pt-20">
        <CircularProgress size={100} thickness={4} />
      </div>
    );
  }

  return (
    <div
      className="overflow-auto"
      style={{
        maxHeight: 'calc(100vh - 15rem)',
        scrollbarWidth: 'thin',
        scrollbarColor: '#1E242B',
      }}
    >
      <style jsx global>{`
        /* Webkit browsers (Chrome, Safari) */
        .overflow-auto::-webkit-scrollbar {
          width: 10px;
        }
        .overflow-auto::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        .overflow-auto::-webkit-scrollbar-thumb {
          background: #1e242b;
          border-radius: 10px;
          border: 2px solid #f3f4f6;
        }
        .overflow-auto::-webkit-scrollbar-thumb:hover {
          background: #1e242b;
        }
      `}</style>

      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell className="w-2/6">
              <strong>ID</strong>
            </TableCell>
            <TableCell align="center" className="w-1/12">
              <strong>Fecha</strong>
            </TableCell>
            <TableCell align="center" className="w-1/12">
              <strong>Participantes</strong>
            </TableCell>
            <TableCell align="center" className="w-1/6">
              <strong>Empresa</strong>
            </TableCell>
            <TableCell align="center" className="w-1/6">
              <strong>Categoría</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {conversations.map((conversation, index) => (
            <TableRow
              id={conversation.conversation_id + '_' + index}
              key={conversation.conversation_id}
              onClick={() => onCallClick(conversation.conversation_id)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <TableCell>
                <p>{conversation.conversation_id}</p>
              </TableCell>
              <TableCell align="center">
                <p>
                  {conversation.start_time
                    ? new Date(
                        conversation.start_time.toString()
                      ).toLocaleDateString()
                    : 'N/A'}
                </p>
              </TableCell>
              <TableCell align="center">
                <div className="flex flex-wrap justify-center">
                  {conversation.participants}
                </div>
              </TableCell>
              <TableCell align="center">
                <div className="flex flex-wrap justify-center">
                  {conversation.company}
                </div>
              </TableCell>
              <TableCell align="center">
                <div className="flex flex-wrap justify-center">
                  {conversation.category && (
                    <Tag
                      key={conversation.category}
                      text={conversation.category}
                    />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
