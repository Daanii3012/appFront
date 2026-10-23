export interface Mensaje {
  id: number;
  sender_id: number;
  username: string;
  content: string;
  sent_at?: string;
}
