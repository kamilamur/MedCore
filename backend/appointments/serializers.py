from rest_framework import serializers
from .models import Appointment
class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)
    doctor_specialty = serializers.CharField(source='doctor.specialty', read_only=True)
    class Meta:
        model = Appointment
        fields = [
            'id',
            'doctor',
            'doctor_name',
            'doctor_specialty',
            'appointment_date',
            'appointment_time',
            'status',
            'created_at',
        ]
class CreateAppointmentSerializer(serializers.Serializer):
    doctor = serializers.IntegerField()
    appointment_date = serializers.DateField()
    appointment_time = serializers.TimeField()

    def validate(self, data):
        conflict = Appointment.objects.filter(
            doctor_id=data['doctor'],
            appointment_date=data['appointment_date'],
            appointment_time=data['appointment_time'],
            status='upcoming'
        ).exists()
        if conflict:
            raise serializers.ValidationError("This time slot is already booked.")
        return data