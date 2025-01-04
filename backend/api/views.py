import logging

from django.db.models import Q
from rest_framework import generics, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Patient
from .serializers import PatientSerializer

logger = logging.getLogger(__name__)


class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100

    def get_paginated_response(self, data):
        logger.info(
            f"Pagination: page={self.page.number}, page_size={self.page_size}, total={self.page.paginator.count}"
        )
        return Response(
            {
                "count": self.page.paginator.count,
                "next": self.get_next_link(),
                "previous": self.get_previous_link(),
                "results": data,
            }
        )


class PatientListCreateView(generics.ListCreateAPIView):
    """
    Handles listing all patients and creating a new patient.
    """

    queryset = Patient.objects.all().order_by("-created_at")
    serializer_class = PatientSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        logger.info(f"Fetching patients. Query params: {self.request.query_params}")
        return queryset

    def list(self, request, *args, **kwargs):
        logger.info(f"Processing list request with params: {request.query_params}")
        response = super().list(request, *args, **kwargs)
        logger.info(f"Returning {len(response.data['results'])} patients")
        return response


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
