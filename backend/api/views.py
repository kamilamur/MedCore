from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Doctor, QueueEntry, Reminder
from .serializers import (
    DoctorSerializer,
    QueueEntrySerializer,
    LoginSerializers,
    ReminderSerializer,
    UserSerializer,
    RegisterSerializer,
)
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializers(data=request.data)
    if serializer.is_valid():
        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )

        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'username': user.username,
                'is_staff': user.is_staff,
                'user_id': user.id
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.user.auth_token.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        userserializers = UserSerializer(request.user)
        reminders = Reminder.objects.filter(user=request.user)
        reminders_serializer = ReminderSerializer(reminders, many=True)

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


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created successfully"}, status=201)
    return Response(serializer.errors, status=400)


class DoctorListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        doctors = Doctor.objects.all()
        serializer = DoctorSerializer(doctors, many=True)
        return Response(serializer.data)


class QueueListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, doctor_id):
        queue_entries = QueueEntry.objects.filter(doctor_id=doctor_id).order_by('position')
        serializer = QueueEntrySerializer(queue_entries, many=True)
        return Response(serializer.data)

    def post(self, request, doctor_id):
        user_id = request.data.get('user')

        if not user_id:
            return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        existing_entry = QueueEntry.objects.filter(doctor_id=doctor_id, user_id=user_id).first()
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
            return Response({'error': 'Queue entry not found'}, status=status.HTTP_404_NOT_FOUND)