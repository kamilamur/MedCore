export interface QueueEntry {
  id: number;
  user: number;
  user_username: string;
  doctor: number;
  doctor_first_name: string;
  doctor_last_name: string;
  doctor_specialization: string;
  doctor_room_number: string;
  position: number;
  created_at: string;
}