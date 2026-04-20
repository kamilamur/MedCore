from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Doctor, QueueEntry, Reminder,Organization

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'address', 'contact_phone', 'description']
class DoctorSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    class Meta:
        model = Doctor
        fields = ['id', 'user', 'first_name', 'last_name', 'specialization', 'room_number', 'organization_name']
class QueueEntrySerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    doctor_first_name = serializers.CharField(source='doctor.user.first_name', read_only=True)
    doctor_last_name = serializers.CharField(source='doctor.user.last_name', read_only=True)
    doctor_specialization = serializers.CharField(source='doctor.specialization', read_only=True)
    doctor_room_number = serializers.CharField(source='doctor.room_number', read_only=True)
    organization_name = serializers.CharField(source='doctor.organization.name', read_only=True)
    class Meta:
        model = QueueEntry
        fields = [
            'id',
            'user',
            'user_username',
            'doctor',
            'doctor_first_name',
            'doctor_last_name',
            'doctor_specialization',
            'doctor_room_number',
            'organization_name',
            'position',
            'created_at',
        ]
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['username', 'password']
    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
class ReminderSerializer(serializers.ModelSerializer):
    doctor_first_name = serializers.CharField(source='appointment.doctor.user.first_name', read_only=True)
    doctor_last_name = serializers.CharField(source='appointment.doctor.user.last_name', read_only=True)
    doctor_specialization = serializers.CharField(source='appointment.doctor.specialization', read_only=True)
    appointment_date = serializers.DateField(source='appointment.appointment_date', read_only=True)
    appointment_time = serializers.TimeField(source='appointment.appointment_time', read_only=True)
    class Meta:
        model = Reminder
        fields = [
            'id',
            'user',
            'appointment',
            'doctor_first_name',
            'doctor_last_name',
            'doctor_specialization',
            'appointment_date',
            'appointment_time',
            'remind_time',
            'is_sent'
        ]
        read_only_fields = ['user']
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']