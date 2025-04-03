export interface ParticipantsResponse {
    participants: Participant[];
  }
  
  export interface Participant {
    users: User;
  }
  
  export interface User {
    role: string;
    username: string;
  }