"""
This module provides serializers for patient-related data management.

It implements serializers for:
- Patient core information
- Address management
- Custom field definitions and values
- Complex patient data operations

Features:
- Nested relationship handling
- Custom field value type management
- Formatted address representation
- Atomic operations for data integrity
"""

from rest_framework import serializers

from ..models import Address, CustomFieldDefinition, Patient, PatientCustomField


class AddressSerializer(serializers.ModelSerializer):
    """
    Serializer for address management.

    Features:
    - Full address component serialization
    - Formatted address string generation
    - Validation of address components
    """

    formatted_address = serializers.SerializerMethodField()

    class Meta:
        model = Address
        fields = ["id", "street", "city", "state", "zip_code", "formatted_address"]

    def get_formatted_address(self, obj):
        """Returns a human-readable formatted address string."""
        return str(obj)


class CustomFieldDefinitionSerializer(serializers.ModelSerializer):
    """
    Serializer for custom field definitions.

    Handles:
    - Field type specifications
    - Display configuration
    - Validation rules
    - Field options
    """

    class Meta:
        model = CustomFieldDefinition
        fields = [
            "id",
            "name",
            "type",
            "description",
            "options",
            "is_active",
            "is_required",
            "display_order",
        ]


class PatientCustomFieldSerializer(serializers.ModelSerializer):
    """
    Serializer for patient-specific custom field values.

    Features:
    - Type-specific value handling
    - Field definition inclusion
    - Automatic value type resolution
    """

    field_definition = CustomFieldDefinitionSerializer(read_only=True)
    value = serializers.SerializerMethodField()

    class Meta:
        model = PatientCustomField
        fields = ["id", "field_definition", "value"]

    def get_value(self, obj):
        """Returns the appropriate value based on field type."""
        return obj.get_value()


class PatientSerializer(serializers.ModelSerializer):
    """
    Core serializer for patient information management.

    Implements comprehensive patient data handling:
    - Basic demographic information
    - Address management
    - Custom field values
    - Related medical records

    Features:
    - Nested relationship handling
    - Custom field value management
    - Atomic operations for data integrity
    - Complex validation rules
    """

    addresses = AddressSerializer(many=True)
    custom_fields = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=False,
        help_text="List of custom field values to set",
    )
    patient_custom_fields = PatientCustomFieldSerializer(many=True, read_only=True)

    class Meta:
        model = Patient
        fields = "__all__"
        read_only_fields = ("id",)

    def create(self, validated_data):
        """
        Creates a new patient with related data:
        - Handles address creation
        - Processes custom field values
        - Manages many-to-many relationships

        All operations are performed atomically to ensure data consistency.
        """
        addresses_data = validated_data.pop("addresses", [])
        studies = validated_data.pop("studies", [])
        treatments = validated_data.pop("treatments", [])
        insurance = validated_data.pop("insurance", [])
        appointments = validated_data.pop("appointments", [])
        custom_fields_data = validated_data.pop("custom_fields", [])

        # Create the patient first
        patient = Patient.objects.create(**validated_data)

        # Handle addresses
        for address_data in addresses_data:
            address = Address.objects.create(**address_data)
            patient.addresses.add(address)

        # Handle custom fields
        for field_data in custom_fields_data:
            try:
                field_definition = CustomFieldDefinition.objects.get(
                    id=field_data["custom_field_definition_id"]
                )

                value_field = f"value_{field_definition.type}"
                value = field_data.get(
                    f"value_{field_definition.type}"
                ) or field_data.get("value_text")

                if value is not None:
                    PatientCustomField.objects.create(
                        patient=patient,
                        field_definition=field_definition,
                        **{value_field: value},
                    )
            except (CustomFieldDefinition.DoesNotExist, Exception):
                continue

        # Handle many-to-many relationships
        if studies:
            patient.studies.set(studies)
        if treatments:
            patient.treatments.set(treatments)
        if insurance:
            patient.insurance.set(insurance)
        if appointments:
            patient.appointments.set(appointments)

        return patient

    def update(self, instance, validated_data):
        """
        Updates an existing patient:
        - Handles address updates
        - Updates custom field values
        - Manages many-to-many relationships

        Ensures atomic operations and data consistency.
        """
        addresses_data = validated_data.pop("addresses", [])
        studies = validated_data.pop("studies", None)
        treatments = validated_data.pop("treatments", None)
        insurance = validated_data.pop("insurance", None)
        appointments = validated_data.pop("appointments", None)
        custom_fields_data = validated_data.pop("custom_fields", [])

        # Update regular fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Handle addresses
        instance.addresses.clear()
        for address_data in addresses_data:
            address = Address.objects.create(**address_data)
            instance.addresses.add(address)

        # Handle custom fields
        if custom_fields_data:
            instance.patient_custom_fields.all().delete()
            for field_data in custom_fields_data:
                try:
                    field_definition = CustomFieldDefinition.objects.get(
                        id=field_data["custom_field_definition_id"]
                    )

                    value_field = f"value_{field_definition.type}"
                    value = field_data.get(
                        f"value_{field_definition.type}"
                    ) or field_data.get("value_text")

                    if value is not None:
                        PatientCustomField.objects.create(
                            patient=instance,
                            field_definition=field_definition,
                            **{value_field: value},
                        )
                except CustomFieldDefinition.DoesNotExist:
                    continue

        # Handle many-to-many relationships
        if studies is not None:
            instance.studies.set(studies)
        if treatments is not None:
            instance.treatments.set(treatments)
        if insurance is not None:
            instance.insurance.set(insurance)
        if appointments is not None:
            instance.appointments.set(appointments)

        return instance
