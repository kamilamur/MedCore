from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Doctor, QueueEntry, Reminder
from .serializers import (
    DoctorSerializer,
    QueueEntrySerializer,
    LoginSerializer,
    ReminderSerializer,
    UserSerializer,
    RegisterSerializer,
)
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )
        if user:
            refresh = RefreshToken.for_user(user)

            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'username': user.username,
                'is_staff': user.is_staff,
                'role': 'admin' if user.is_staff else 'patient',
                'user_id': user.id
            }, status=status.HTTP_200_OK)

        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    return Response(
        {'message': 'Logged out successfully'},
        status=status.HTTP_200_OK
    )
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "User created successfully"},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user_serializer = UserSerializer(request.user)
        reminders = Reminder.objects.filter(
            user=request.user,
            appointment__status='upcoming'
        )
        reminders_serializer = ReminderSerializer(reminders, many=True)
        return Response({
            'user': user_serializer.data,
            'role': 'admin' if request.user.is_staff else 'patient',
            'reminders': reminders_serializer.data
        })
    def post(self, request):
        serializer = ReminderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
class DoctorListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        doctors = Doctor.objects.all()
        serializer = DoctorSerializer(doctors, many=True)
        return Response(serializer.data)
class QueueListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, doctor_id):
        queue_entries = QueueEntry.objects.filter(
            doctor_id=doctor_id
        ).order_by('position')
        serializer = QueueEntrySerializer(queue_entries, many=True)
        return Response(serializer.data)

    def post(self, request, doctor_id):
        user_id = request.data.get('user')

        if not user_id:
            return Response(
                {'error': 'User ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        existing_entry = QueueEntry.objects.filter(
            doctor_id=doctor_id,
            user_id=user_id
        ).first()

        if existing_entry:
            serializer = QueueEntrySerializer(existing_entry)
            return Response(serializer.data, status=status.HTTP_200_OK)

        position = QueueEntry.objects.filter(doctor_id=doctor_id).count() + 1

        entry = QueueEntry.objects.create(
            doctor_id=doctor_id,
            user_id=user_id,
            position=position
        )

        serializer = QueueEntrySerializer(entry)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
class QueueEntryDeleteView(APIView):
    permission_classes = [AllowAny]
    def delete(self, request, entry_id):
        try:
            entry = QueueEntry.objects.get(id=entry_id)
            doctor_id = entry.doctor_id
            deleted_position = entry.position
            entry.delete()

            remaining_entries = QueueEntry.objects.filter(
                doctor_id=doctor_id,
                position__gt=deleted_position
            ).order_by('position')

            for queue_entry in remaining_entries:
                queue_entry.position -= 1
                queue_entry.save()

            return Response(status=status.HTTP_204_NO_CONTENT)
        except QueueEntry.DoesNotExist:
            return Response(
                {'error': 'Queue entry not found'},
                status=status.HTTP_404_NOT_FOUND
            )
class QueueOverviewView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        if request.user.is_staff:
            entries = QueueEntry.objects.all().order_by('doctor_id', 'position')
        else:
            entries = QueueEntry.objects.filter(user=request.user).order_by('doctor_id', 'position')
        serializer = QueueEntrySerializer(entries, many=True)
        return Response(serializer.data)