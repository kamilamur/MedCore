export interface Doctor {
  id: number;
  specialization: string;
  room_number: string;
  user: number;
}

export interface QueueEntry {
  id: number;
  position: number;
  user: number;
  doctor: number;
}