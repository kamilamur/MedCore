from django.urls import path
from .views import DoctorListView, QueueListView
from . import views

urlpatterns = [
    path('doctors/', DoctorListView.as_view(), name='doctors-list'),
    path('queue/<int:doctor_id>/', QueueListView.as_view(), name='queue-list'),
    path('login/', views.login_view, name = 'login'),
    path('logout/', views.logout_view, name = 'logout'),
    path('profile/', views.ProfileView.as_view(), name = 'profile'),
]