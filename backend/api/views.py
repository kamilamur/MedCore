from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Doctor, QueueEntry
from .serializers import DoctorSerializer, QueueEntrySerializer

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