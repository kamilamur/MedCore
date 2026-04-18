from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Doctor, QueueEntry, Reminder
from .serializers import DoctorSerializer, QueueEntrySerializer, LoginSerializers, ReminderSerializer, UserSerializer
from django.shortcuts import render
from rest_framework.decorators import api_view , permission_classes
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializers(data = request.data)
    if serializer.is_valid():
        user = authenticate(
            username = serializer.validated_data['username'],
            password = serializer.validated_data['password']
        )

        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'username': user.username,
                'is_staff': user.is_staff, 
                'user_id': user.id })
        return Response({'error': 'Invalid credentials'},status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.user.auth_token.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

class ProfileView(APIView):
    permission_classes= [IsAuthenticated]

    def get(self, request):
        userserializers = UserSerializer(request.user)
        reminders = Reminder.objects.filter(user=request.user)
        reminders_serializer = ReminderSerializer(reminders, many = True)

        return Response({
            'user': userserializers.data,
            'reminders': reminders_serializer.data
        })
    
    def post(self, request):
        serializer = ReminderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class DoctorListView(APIView):
    def get(self, request):
        doctors = Doctor.objects.all()
        serializer = DoctorSerializer(doctors, many=True)
        return Response(serializer.data)


class QueueListView(APIView):
    def get(self, request, doctor_id):
        queue_entries = QueueEntry.objects.filter(doctor_id=doctor_id)
        serializer = QueueEntrySerializer(queue_entries, many=True)
        return Response(serializer.data)
# Create your views here.