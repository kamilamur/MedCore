from django.db import models
from django.contrib.auth.models import User
class Organization(models.Model):
    name = models.CharField(max_length=255, verbose_name="Name")
    address = models.CharField(max_length=500, verbose_name="Address")
    contact_phone = models.CharField(max_length=20, verbose_name="Phone")
    description = models.TextField(blank=True, verbose_name="Description")

    def __str__(self):
        return self.name
    
class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    organization = models.ForeignKey(
        Organization, 
        on_delete=models.SET_NULL, 
        related_name='doctors',
        null=True, 
        blank=True
    )
    specialization = models.CharField(max_length=100)
    room_number = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.user.username} ({self.specialization}) - {self.organization.name if self.organization else 'No Org'}"
    
class QueueEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    position = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.doctor.user.username}"  
    
class Reminder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    appointment = models.ForeignKey('appointments.Appointment', on_delete=models.CASCADE)
    remind_time = models.DateTimeField()
    is_sent = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Reminder for {self.user.username} at {self.remind_time}"