from django.db.models import Q
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Patient
from .serializers import PatientSerializer


class PatientListCreateView(generics.ListCreateAPIView):
    """
    Handles listing all patients and creating a new patient.
    """

    queryset = Patient.objects.all()
    serializer_class = PatientSerializer


class PatientRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """
    Handles retrieving, updating, and deleting a single patient.
    """

    queryset = Patient.objects.all()
    serializer_class = PatientSerializer


class PatientQueryView(APIView):
    def get(self, request):
        query = request.query_params.get("q", None)  # Get query string from request
        if not query:
            return Response(
                {"error": "Query parameter 'q' is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Perform a case-insensitive search on ID, first_name, last_name, or middle_name
        patients = Patient.objects.filter(
            Q(id__icontains=query)
            | Q(first_name__icontains=query)
            | Q(last_name__icontains=query)
            | Q(middle_name__icontains=query)
        )

        # Serialize and return the data
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
