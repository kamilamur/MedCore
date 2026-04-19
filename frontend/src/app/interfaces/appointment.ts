export interface Appointment {
  id: number;
  patient: number;
  patient_username: string;
  doctor: number;
  doctor_first_name: string;
  doctor_last_name: string;
  doctor_specialization: string;
  doctor_room_number: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  cancelled_by: number | null;
  cancelled_by_username: string | null;
  created_at: string;
}