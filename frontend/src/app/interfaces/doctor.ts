export interface Doctor {
  id: number;
  user: number;
  first_name: string;
  last_name: string;
  specialization: string;
  room_number: string;
  organization_name: string | null;
}