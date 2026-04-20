from django.contrib import admin
from .models import Doctor, QueueEntry, Reminder, Organization

admin.site.register(Organization)
admin.site.register(Doctor)
admin.site.register(QueueEntry)
admin.site.register(Reminder)