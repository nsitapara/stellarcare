"""
This module provides views for administrative record management.

Features:
- Appointment management
- Insurance record access
- Read-only operations
- Access control
"""

import logging

from rest_framework import generics

from ..models import Insurance, Visit
from ..serializers import InsuranceSerializer, VisitSerializer

logger = logging.getLogger(__name__)


class AppointmentDetailView(generics.RetrieveAPIView):
    """
    View for retrieving appointment details.

    Features:
    - Read-only access
    - Visit scheduling information
    - Telehealth integration
    - Status tracking

    Notes:
    - Currently supports only retrieval operations
    - Future updates may include scheduling capabilities
    """

    queryset = Visit.objects.all()
    serializer_class = VisitSerializer


class InsuranceDetailView(generics.RetrieveAPIView):
    """
    View for retrieving insurance record details.

    Features:
    - Read-only access
    - Policy information
    - Authorization status
    - Coverage details

    Notes:
    - Currently supports only retrieval operations
    - Future updates may include verification capabilities
    """

    queryset = Insurance.objects.all()
    serializer_class = InsuranceSerializer
