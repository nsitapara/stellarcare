"""
This module provides serializers for medical record management.

It implements serializers for:
- Sleep study results
- Treatment records
- Medical metrics
- File attachments

Features:
- Metric validation
- Date range handling
- File URL management
- Notes and documentation
"""

from rest_framework import serializers

from ..models import SleepStudy, Treatment


class SleepStudySerializer(serializers.ModelSerializer):
    """
    Serializer for sleep study records.

    Handles:
    - Sleep study metrics (AHI, efficiency, REM latency)
    - Study dates and timing
    - File attachments
    - Study notes
    """

    class Meta:
        model = SleepStudy
        fields = [
            "id",
            "date",
            "ahi",
            "sleep_efficiency",
            "rem_latency",
            "notes",
            "file_url",
        ]


class TreatmentSerializer(serializers.ModelSerializer):
    """
    Serializer for treatment records.

    Features:
    - Treatment type categorization
    - Dosage and frequency tracking
    - Treatment period management
    - Progress notes
    """

    class Meta:
        model = Treatment
        fields = [
            "id",
            "name",
            "type",
            "dosage",
            "frequency",
            "start_date",
            "end_date",
            "notes",
        ]
