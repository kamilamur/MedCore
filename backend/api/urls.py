from django.urls import path
from .views import DoctorListView, QueueListView

urlpatterns = [
    path('doctors/', DoctorListView.as_view(), name='doctors-list'),
    path('queue/<int:doctor_id>/', QueueListView.as_view(), name='queue-list'),
]