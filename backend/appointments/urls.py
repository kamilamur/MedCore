from django.urls import path
from .views import AppointmentListCreateAPIView, AppointmentDetailAPIView
urlpatterns = [
    path('appointments/', AppointmentListCreateAPIView.as_view(), name='appointments'),
    path('appointments/<int:pk>/', AppointmentDetailAPIView.as_view(), name='appointment-detail'),
]