from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Appointment
from .serializers import AppointmentSerializer, CreateAppointmentSerializer
class AppointmentListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        if request.user.is_staff:
            appointments = Appointment.objects.all().order_by('-appointment_date', '-appointment_time')
        else:
            appointments = Appointment.objects.filter(patient=request.user).order_by('-appointment_date', '-appointment_time')

        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)
    def post(self, request):
        if request.user.is_staff:
            return Response(
                {"error": "Admins cannot create appointments."},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = CreateAppointmentSerializer(data=request.data)
        if serializer.is_valid():
            appointment = Appointment.objects.create(
                patient=request.user,
                doctor_id=serializer.validated_data['doctor'],
                appointment_date=serializer.validated_data['appointment_date'],
                appointment_time=serializer.validated_data['appointment_time'],
                status='upcoming'
            )
            output_serializer = AppointmentSerializer(appointment)
            return Response(output_serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class AppointmentDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get_object(self, pk, user):
        try:
            if user.is_staff:
                return Appointment.objects.get(pk=pk)
            return Appointment.objects.get(pk=pk, patient=user)
        except Appointment.DoesNotExist:
            return None
    def get(self, request, pk):
        appointment = self.get_object(pk, request.user)
        if not appointment:
            return Response({"error": "Appointment not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data)
    def put(self, request, pk):
        appointment = self.get_object(pk, request.user)
        if not appointment:
            return Response({"error": "Appointment not found."}, status=status.HTTP_404_NOT_FOUND)
        doctor_id = request.data.get('doctor', appointment.doctor_id)
        appointment_date = request.data.get('appointment_date', appointment.appointment_date)
        appointment_time = request.data.get('appointment_time', appointment.appointment_time)
        status_value = request.data.get('status', appointment.status)
        conflict = Appointment.objects.filter(
            doctor_id=doctor_id,
            appointment_date=appointment_date,
            appointment_time=appointment_time,
            status='upcoming'
        ).exclude(id=appointment.id).exists()
        if conflict:
            return Response(
                {"error": "This time slot is already booked."},
                status=status.HTTP_400_BAD_REQUEST
            )
        appointment.doctor_id = doctor_id
        appointment.appointment_date = appointment_date
        appointment.appointment_time = appointment_time
        appointment.status = status_value
        appointment.save()
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data)
    def delete(self, request, pk):
        appointment = self.get_object(pk, request.user)
        if not appointment:
            return Response({"error": "Appointment not found."}, status=status.HTTP_404_NOT_FOUND)
        appointment.delete()
        return Response({"message": "Appointment deleted successfully."}, status=status.HTTP_200_OK)