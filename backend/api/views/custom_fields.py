"""
This module provides views for custom field management.

Features:
- Custom field definition CRUD
- Field assignment to users
- Value management for patients
- Access control
"""

import logging

from rest_framework import generics, status
from rest_framework.response import Response

from ..models import CustomFieldDefinition, PatientCustomField
from ..serializers import (
    CustomFieldDefinitionSerializer,
    PatientCustomFieldSerializer,
)

logger = logging.getLogger(__name__)


class CustomFieldDefinitionListCreateView(generics.ListCreateAPIView):
    """
    View for managing custom field definitions.

    Endpoints:
    - GET: List all custom field definitions
    - POST: Create new custom field definition

    Features:
    - Automatic user assignment
    - Ordered listing
    - Creation logging
    - Error handling
    """

    queryset = CustomFieldDefinition.objects.all().order_by("display_order", "name")
    serializer_class = CustomFieldDefinitionSerializer

    def create(self, request, *args, **kwargs):
        """
        Creates a new custom field definition and assigns it to the creating user.

        Process:
        1. Creates the custom field
        2. Associates it with the creating user
        3. Logs the creation
        4. Handles any errors
        """
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
    View for listing custom fields assigned to the current user.

    Features:
    - User-specific field listing
    - Ordered display
    - Access control
    """

    serializer_class = CustomFieldDefinitionSerializer

    def get_queryset(self):
        """Returns only custom fields assigned to the current user."""
        user = self.request.user
        logger.info(f"Fetching assigned custom fields for user: {user.email}")
        return user.available_custom_fields.all().order_by("display_order", "name")


class CustomFieldDefinitionRetrieveUpdateDeleteView(
    generics.RetrieveUpdateDestroyAPIView
):
    """
    View for managing individual custom field definitions.

    Endpoints:
    - GET: Retrieve field details
    - PUT/PATCH: Update field configuration
    - DELETE: Remove field definition

    Features:
    - Full CRUD operations
    - Validation of updates
    - Cascading deletion handling
    """

    queryset = CustomFieldDefinition.objects.all()
    serializer_class = CustomFieldDefinitionSerializer


class PatientCustomFieldListView(generics.ListAPIView):
    """
    View for listing custom field values for a specific patient.

    Features:
    - Patient-specific value listing
    - Efficient database queries
    - Field definition inclusion
    """

    serializer_class = PatientCustomFieldSerializer

    def get_queryset(self):
        """Returns custom field values for a specific patient with optimized queries."""
        patient_id = self.kwargs.get("patient_id")
        return PatientCustomField.objects.filter(patient_id=patient_id).select_related(
            "field_definition"
        )


class CustomFieldDefinitionAssignView(generics.GenericAPIView):
    """
    View for assigning custom fields to users.

    Features:
    - Field assignment management
    - Error handling
    - Assignment logging
    """

    queryset = CustomFieldDefinition.objects.all()
    serializer_class = CustomFieldDefinitionSerializer

    def post(self, request, *args, **kwargs):
        """
        Assigns a custom field to the current user.

        Process:
        1. Gets the field definition
        2. Associates it with the user
        3. Logs the assignment
        4. Handles any errors
        """
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

    def delete(self, request, *args, **kwargs):
        """
        Unassigns a custom field from the current user.

        Process:
        1. Gets the field definition
        2. Removes it from the user's available fields
        3. Logs the unassignment
        4. Handles any errors
        """
        custom_field = self.get_object()
        user = request.user
        logger.info(
            f"Unassigning custom field {custom_field.id} from user {user.email}"
        )

        try:
            user.available_custom_fields.remove(custom_field)
            logger.info("Successfully unassigned custom field from user")
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error unassigning custom field from user: {e}")
            raise
