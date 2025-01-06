"""
This module provides serializers for administrative record management.

It implements serializers for:
- Visit scheduling and tracking
- Insurance information
- Authorization management
- Administrative documentation

Features:
- Visit type handling
- Status tracking
- Insurance verification
- Authorization expiry management
"""

from rest_framework import serializers

from ..models import Insurance, Visit


class VisitSerializer(serializers.ModelSerializer):
    """
    Serializer for visit management.

    Features:
    - Visit type categorization (In-Person/Telehealth)
    - Status tracking
    - Scheduling management
    - Telehealth integration
    """

    class Meta:
        model = Visit
        fields = ["id", "date", "time", "type", "status", "notes", "zoom_link"]


class InsuranceSerializer(serializers.ModelSerializer):
    """
    Serializer for insurance record management.

    Features:
    - Provider information tracking
    - Policy management
    - Authorization status handling
    - Expiry date monitoring
    """

    class Meta:
        model = Insurance
        fields = [
            "id",
            "provider",
            "policy_number",
            "group_number",
            "primary_holder",
            "relationship",
            "authorization_status",
            "authorization_expiry",
        ]
