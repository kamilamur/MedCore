from rest_framework import serializers
from .models import Appointment
class AppointmentSerializer(serializers.ModelSerializer):
    patient_username = serializers.CharField(source='patient.username', read_only=True)
    doctor_first_name = serializers.CharField(source='doctor.user.first_name', read_only=True)
    doctor_last_name = serializers.CharField(source='doctor.user.last_name', read_only=True)
    doctor_specialization = serializers.CharField(source='doctor.specialization', read_only=True)
    doctor_room_number = serializers.CharField(source='doctor.room_number', read_only=True)
    cancelled_by_username = serializers.CharField(
        source='cancelled_by.username',
        read_only=True
    )
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = [
            'patient',
            'created_at',
            'cancelled_by',
            'patient_username',
            'doctor_first_name',
            'doctor_last_name',
            'doctor_specialization',
            'doctor_room_number',
            'cancelled_by_username',
        ]