import { Conversation } from './conversation';
import { Messages } from './messages';
import { Participant } from './participants';
import { Summary } from './summary';

export interface SpecificCall {
  conversation: Conversation;
  summary: Summary;
  messages: Messages[];
  participants: Participant[];
  company: {
    logo: string;
    name: string;
  };
  rating: {
    average: number;
    count: number;
  };
}
