from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from datetime import datetime, timedelta
from .models import Appointment
from .serializers import AppointmentSerializer
from api.models import Reminder
class AppointmentListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        if request.user.is_staff:
            appointments = Appointment.objects.all().order_by('-created_at')
        else:
            appointments = Appointment.objects.filter(
                patient=request.user
            ).order_by('-created_at')

        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)

        if serializer.is_valid():
            appointment = serializer.save(patient=request.user)
            remind_time = datetime.combine(
                appointment.appointment_date,
                appointment.appointment_time
            ) - timedelta(hours=1)
            Reminder.objects.create(
                user=request.user,
                appointment=appointment,
                remind_time=remind_time,
                is_sent=False
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class AppointmentDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def patch(self, request, pk):
        try:
            if request.user.is_staff:
                appointment = Appointment.objects.get(id=pk)
            else:
                appointment = Appointment.objects.get(id=pk, patient=request.user)
        except Appointment.DoesNotExist:
            return Response({'error': 'Appointment not found'}, status=404)
        status_value = request.data.get('status')
        if status_value:
            appointment.status = status_value
            if status_value == 'cancelled':
                appointment.cancelled_by = request.user
                Reminder.objects.filter(appointment=appointment).delete()
            appointment.save()
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data)
    def delete(self, request, pk):
        try:
            if request.user.is_staff:
                appointment = Appointment.objects.get(id=pk)
            else:
                appointment = Appointment.objects.get(id=pk, patient=request.user)
        except Appointment.DoesNotExist:
            return Response({'error': 'Appointment not found'}, status=404)
        Reminder.objects.filter(appointment=appointment).delete()
        appointment.delete()
        return Response(status=204)