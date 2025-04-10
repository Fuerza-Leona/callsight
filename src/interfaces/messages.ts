export interface Messages {
  message_id: string;
  conversation_id: string;
  speaker: number;
  text: string;
  offsetmilliseconds: number;
  positive: number;
  neutral: number;
  negative: number;
  confidence: number;
  role: string;
}
