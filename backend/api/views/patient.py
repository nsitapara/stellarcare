"""
This module provides views for patient management.

Features:
- Patient CRUD operations
- Search functionality
- Pagination
- Detailed logging
"""

import logging

from django.db.models import Q
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Patient
from ..serializers import PatientSerializer
from .base import CustomPagination

logger = logging.getLogger(__name__)


class PatientListCreateView(generics.ListCreateAPIView):
    """
    View for listing and creating patients.

    Endpoints:
    - GET: List all patients with pagination
    - POST: Create a new patient

    Features:
    - Pagination support
    - Ordering by creation date
    - Detailed logging
    - Error handling
    """

    serializer_class = PatientSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        """Returns optimized queryset with prefetched related fields."""
        queryset = (
            Patient.objects.all()
            .order_by("-created_at")
            .prefetch_related(
                "addresses",
                "patient_custom_fields",
                "patient_custom_fields__field_definition",
            )
        )
        logger.info(f"Fetching patients. Query params: {self.request.query_params}")
        return queryset

    def list(self, request, *args, **kwargs):
        """
        Lists patients with detailed logging.
        Includes request parameters and response size in logs.
        """
        logger.info(f"Processing list request with params: {request.query_params}")
        response = super().list(request, *args, **kwargs)
        logger.info(f"Returning {len(response.data['results'])} patients")
        return response


class PatientRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """
    View for managing individual patients.

    Endpoints:
    - GET: Retrieve patient details
    - PUT/PATCH: Update patient information
    - DELETE: Remove patient record

    Features:
    - Full CRUD operations
    - Validation of updates
    - Cascading deletion handling
    """

    serializer_class = PatientSerializer

    def get_queryset(self):
        """Returns optimized queryset with prefetched related fields."""
        return Patient.objects.all().prefetch_related(
            "addresses",
            "patient_custom_fields",
            "patient_custom_fields__field_definition",
        )


class PatientQueryView(APIView):
    """
    View for searching patients.

    Features:
    - Search by ID (exact match)
    - Search by name (case-insensitive partial match)
    - Detailed error responses
    - Search result logging

    Query Parameters:
    - q: Search query (required)
        - Numeric: Searches by ID
        - Text: Searches first, middle, last names
    """

    def get(self, request):
        """
        Handles patient search requests.

        Process:
        1. Validates query parameter
        2. Determines search type (ID vs name)
        3. Performs appropriate search
        4. Logs results
        5. Returns formatted response
        """
        query = request.query_params.get("q", None)
        if not query:
            return Response(
                {"error": "Query parameter 'q' is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        logger.info(f"Searching patients with query: {query}")

        base_queryset = Patient.objects.prefetch_related(
            "addresses",
            "patient_custom_fields",
            "patient_custom_fields__field_definition",
        )

        # If query is numeric, do exact ID match only
        if query.isdigit():
            patients = base_queryset.filter(id=query)
        else:
            # Otherwise do case-insensitive search on names
            patients = base_queryset.filter(
                Q(first__icontains=query)
                | Q(last__icontains=query)
                | Q(middle__icontains=query)
            )

        logger.info(f"Found {patients.count()} matching patients")

        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
