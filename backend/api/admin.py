from django.contrib import admin
from .models import Doctor, QueueEntry

admin.site.register(Doctor)
admin.site.register(QueueEntry)