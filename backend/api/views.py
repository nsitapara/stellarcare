import logging

from django.db.models import Q
from rest_framework import generics, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CustomFieldDefinition, Patient, PatientCustomField, Visits
from .serializers import (
    CustomFieldDefinitionSerializer,
    PatientCustomFieldSerializer,
    PatientSerializer,
    VisitSerializer,
)

logger = logging.getLogger(__name__)


class CustomPagination(PageNumberPagination):
    """
    Custom pagination class that extends Django REST Framework's PageNumberPagination.
    Provides pagination with configurable page size and maximum page size limits.
    """

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
    """
    API endpoint for searching patients by name or ID.
    Supports:
    - Exact ID match for numeric queries
    - Case-insensitive partial name match for text queries
    """

    def get(self, request):
        query = request.query_params.get("q", None)
        if not query:
            return Response(
                {"error": "Query parameter 'q' is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        logger.info(f"Searching patients with query: {query}")

        # If query is numeric, do exact ID match only
        if query.isdigit():
            patients = Patient.objects.filter(id=query)
        else:
            # Otherwise do case-insensitive search on names
            patients = Patient.objects.filter(
                Q(first__icontains=query)
                | Q(last__icontains=query)
                | Q(middle__icontains=query)
            )

        logger.info(f"Found {patients.count()} matching patients")

        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CustomFieldDefinitionListCreateView(generics.ListCreateAPIView):
    """
    Handles listing all custom field definitions and creating new ones.
    When creating a new custom field:
    1. Creates the custom field definition
    2. Associates it with the creating user
    3. Logs the creation process and any errors
    """

    queryset = CustomFieldDefinition.objects.all().order_by("display_order", "name")
    serializer_class = CustomFieldDefinitionSerializer

    def create(self, request, *args, **kwargs):
        logger.info(f"Creating custom field definition with data: {request.data}")
        logger.info(f"Request user: {request.user.email}")

        response = super().create(request, *args, **kwargs)
        logger.info(f"Created custom field definition response: {response.data}")

        # Associate the new custom field with the creating user
        custom_field = CustomFieldDefinition.objects.get(id=response.data["id"])
        user = request.user
        logger.info(
            f"Associating custom field {custom_field.id} with user {user.email}"
        )

        try:
            user.available_custom_fields.add(custom_field)
            logger.info("Successfully associated custom field with user")
        except Exception as e:
            logger.error(f"Error associating custom field with user: {e}")
            raise

        return response


class CustomFieldDefinitionAssignedView(generics.ListAPIView):
    """
    Returns custom field definitions assigned to the current user.
    """

    serializer_class = CustomFieldDefinitionSerializer

    def get_queryset(self):
        user = self.request.user
        logger.info(f"Fetching assigned custom fields for user: {user.email}")
        return user.available_custom_fields.all().order_by("display_order", "name")


class CustomFieldDefinitionRetrieveUpdateDeleteView(
    generics.RetrieveUpdateDestroyAPIView
):
    """
    Handles retrieving, updating, and deleting a single custom field definition.
    """

    queryset = CustomFieldDefinition.objects.all()
    serializer_class = CustomFieldDefinitionSerializer


class PatientCustomFieldListView(generics.ListAPIView):
    """
    Handles listing all custom field values for a specific patient.
    """

    serializer_class = PatientCustomFieldSerializer

    def get_queryset(self):
        patient_id = self.kwargs.get("patient_id")
        return PatientCustomField.objects.filter(patient_id=patient_id).select_related(
            "field_definition"
        )


class CustomFieldDefinitionAssignView(generics.GenericAPIView):
    """
    Handles assigning a custom field definition to the current user.
    """

    queryset = CustomFieldDefinition.objects.all()
    serializer_class = CustomFieldDefinitionSerializer

    def post(self, request, *args, **kwargs):
        custom_field = self.get_object()
        user = request.user
        logger.info(f"Assigning custom field {custom_field.id} to user {user.email}")

        try:
            user.available_custom_fields.add(custom_field)
            logger.info("Successfully assigned custom field to user")
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error assigning custom field to user: {e}")
            raise


class AppointmentDetailView(generics.RetrieveAPIView):
    """
    Retrieves a single appointment by ID.
    """

    queryset = Visits.objects.all()
    serializer_class = VisitSerializer
