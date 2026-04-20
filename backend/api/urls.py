from django.urls import path
from .views import (
    DoctorListView,
    QueueListView,
    QueueOverviewView,
    QueueEntryDeleteView,
    login_view,
    logout_view,
    register_view,
    ProfileView,
    send_team_application,
    OrganizationListView

)
urlpatterns = [
    path('doctors/', DoctorListView.as_view(), name='doctors-list'),
    path('queue/', QueueOverviewView.as_view(), name='queue-overview'),
    path('queue/<int:doctor_id>/', QueueListView.as_view(), name='queue-list'),
    path('queue-entry/<int:entry_id>/', QueueEntryDeleteView.as_view(), name='queue-entry-delete'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('register/', register_view, name='register'),
    path('send-application/', send_team_application, name='send_team_application'),
    path('organizations/', OrganizationListView.as_view(), name='org-list'),
]