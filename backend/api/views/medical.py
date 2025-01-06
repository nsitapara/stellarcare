"""
This module provides views for medical record management.

Features:
- Sleep study record access
- Treatment record management
- Read-only operations
- Access control
"""

import logging

from rest_framework import generics

from ..models import SleepStudy, Treatment
from ..serializers import SleepStudySerializer, TreatmentSerializer

logger = logging.getLogger(__name__)


class SleepStudyDetailView(generics.RetrieveAPIView):
    """
    View for retrieving sleep study details.

    Features:
    - Read-only access
    - Detailed study metrics
    - File attachment handling

    Notes:
    - Currently supports only retrieval operations
    - Future updates may include creation/modification capabilities
    """

    queryset = SleepStudy.objects.all()
    serializer_class = SleepStudySerializer


class TreatmentDetailView(generics.RetrieveAPIView):
    """
    View for retrieving treatment details.

    Features:
    - Read-only access
    - Treatment history
    - Dosage and frequency information

    Notes:
    - Currently supports only retrieval operations
    - Future updates may include creation/modification capabilities
    """

    queryset = Treatment.objects.all()
    serializer_class = TreatmentSerializer
