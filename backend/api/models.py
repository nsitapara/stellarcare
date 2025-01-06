"""
This module defines the core data models for the StellarCare application.
It implements a comprehensive set of models for managing:
- User accounts and authentication
- Patient information and demographics
- Custom fields and patient-specific data
- Medical records (sleep studies, treatments)
- Insurance information
- Visit scheduling and tracking

The models implement a flexible custom field system that allows for:
- Dynamic field definitions
- Type-specific value storage
- User-specific field availability
- Required/optional field configuration

Key features:
- Automatic patient ID generation
- Comprehensive relationship tracking
- Flexible custom field system
- Temporal data tracking (created/modified timestamps)
- Multi-address support
- Insurance and visit management
"""

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """
    Extended user model for StellarCare application.

    Extends Django's AbstractUser to add:
    - Creation and modification timestamps
    - Custom field availability tracking
    - Enhanced string representation

    The user model supports role-based access through Django's built-in
    groups and permissions system, with additional customization for
    field access control.
    """

    created_at = models.DateTimeField(_("created at"), auto_now_add=True)
    modified_at = models.DateTimeField(_("modified at"), auto_now=True)
    available_custom_fields = models.ManyToManyField(
        "CustomFieldDefinition",
        blank=True,
        related_name="assigned_users",
        help_text="Custom fields this user can view and edit",
    )

    class Meta:
        db_table = "users"
        verbose_name = _("user")
        verbose_name_plural = _("users")

    def __str__(self):
        return self.email if self.email else self.username


class Address(models.Model):
    """
    Stores physical address information.

    Can be associated with multiple patients to support:
    - Primary residence
    - Secondary addresses
    - Billing addresses
    """

    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.street}, {self.city}, {self.state}, {self.zip_code}"


class CustomFieldDefinition(models.Model):
    """
    Defines custom fields that can be assigned to patients.

    Supports:
    - Multiple field types (text, number)
    - Optional/required fields
    - Field ordering
    - Field activation/deactivation
    - User-specific field assignment

    Used to create a flexible, extensible system for storing
    patient-specific data that may vary by user or use case.
    """

    FIELD_TYPES = [
        ("text", "Text"),
        ("number", "Number"),
    ]

    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=FIELD_TYPES)
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Detailed description of the field's purpose and usage",
    )
    options = models.JSONField(
        blank=True,
        null=True,
        help_text="For select type fields, stores the available options",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this field is currently in use",
    )
    is_required = models.BooleanField(
        default=False,
        help_text="Whether this field must be filled for all patients",
    )
    display_order = models.IntegerField(
        default=0,
        help_text="Order in which the field should be displayed in forms",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["display_order", "name"]


class PatientCustomField(models.Model):
    """
    Stores the values of custom fields for each patient.

    Implements a flexible storage system that:
    - Supports multiple value types (text, number)
    - Maintains data integrity through foreign keys
    - Tracks value creation and modification times
    - Ensures one value per field per patient

    The get_value() method automatically returns the appropriate
    value based on the field type.
    """

    patient = models.ForeignKey(
        "Patient",
        on_delete=models.CASCADE,
        related_name="patient_custom_fields",
    )
    field_definition = models.ForeignKey(
        CustomFieldDefinition,
        on_delete=models.CASCADE,
    )
    value_text = models.TextField(blank=True, null=True)
    value_number = models.FloatField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["patient", "field_definition"]

    def __str__(self):
        return f"{self.patient} - {self.field_definition}: {self.get_value()}"

    def get_value(self):
        """Returns the appropriate value based on the field type."""
        if self.field_definition.type == "text":
            return self.value_text
        elif self.field_definition.type == "number":
            return self.value_number
        return None


class SleepStudy(models.Model):
    """
    Records sleep study results and metrics.

    Stores key sleep study metrics including:
    - Apnea-Hypopnea Index (AHI)
    - Sleep efficiency
    - REM latency

    Supports file attachments via URL and additional notes.
    """

    date = models.DateField()
    ahi = models.FloatField(help_text="Apnea-Hypopnea Index")
    sleep_efficiency = models.FloatField(help_text="Sleep efficiency percentage")
    rem_latency = models.FloatField(help_text="Time to REM sleep in minutes")
    notes = models.TextField(blank=True, null=True)
    file_url = models.URLField(
        blank=True,
        null=True,
        help_text="URL to the full sleep study report",
    )


class Treatment(models.Model):
    """
    Tracks patient treatments and medications.

    Supports:
    - Multiple treatment types
    - Dosage and frequency tracking
    - Treatment duration tracking
    - Treatment notes
    """

    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField(
        blank=True,
        null=True,
        help_text="Leave empty for ongoing treatments",
    )
    notes = models.TextField(blank=True, null=True)


class Insurance(models.Model):
    """
    Manages patient insurance information.

    Tracks:
    - Insurance provider details
    - Policy information
    - Authorization status and expiry
    - Primary holder relationship
    """

    provider = models.CharField(max_length=255)
    policy_number = models.CharField(max_length=100)
    group_number = models.CharField(max_length=100)
    primary_holder = models.CharField(max_length=255)
    relationship = models.CharField(max_length=100)
    authorization_status = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Current authorization status",
    )
    authorization_expiry = models.DateField(
        blank=True,
        null=True,
        help_text="When the current authorization expires",
    )


class Visit(models.Model):
    """
    Manages patient visits and appointments.

    Features:
    - Multiple visit types (In-Person, Telehealth)
    - Status tracking
    - Zoom integration for telehealth
    - Notes support
    """

    VISITS_TYPES = [
        ("In-Person", "In-Person"),
        ("Telehealth", "Telehealth"),
    ]

    VISITS_STATUSES = [
        ("Scheduled", "Scheduled"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
        ("No-Show", "No-Show"),
    ]

    date = models.DateField()
    time = models.TimeField()
    type = models.CharField(max_length=20, choices=VISITS_TYPES)
    status = models.CharField(max_length=20, choices=VISITS_STATUSES)
    notes = models.TextField(blank=True, null=True)
    zoom_link = models.URLField(
        blank=True,
        null=True,
        help_text="Zoom meeting link for telehealth visits",
    )


class Patient(models.Model):
    """
    Core patient model managing all patient information.

    Features:
    - Automatic ID generation starting from 100000
    - Comprehensive demographic information
    - Status tracking
    - Temporal data tracking
    - Multiple relationship management:
        - Addresses
        - Custom fields
        - Sleep studies
        - Treatments
        - Insurance
        - Appointments
    """

    PATIENT_STATUSES = [
        ("Inquiry", "Inquiry"),
        ("Onboarding", "Onboarding"),
        ("Active", "Active"),
        ("Churned", "Churned"),
    ]

    def generate_patient_id():
        """
        Generates a unique patient ID.

        Ensures IDs:
        - Start from 100000
        - Are sequential
        - Never decrease
        """
        last_patient = Patient.objects.order_by("-id").first()
        if last_patient:
            return max(100000, last_patient.id + 1)
        return 100000

    id = models.IntegerField(
        primary_key=True,
        editable=False,
        default=generate_patient_id,
        help_text="Unique patient identifier starting from 100000",
    )
    first = models.CharField(max_length=100)
    middle = models.CharField(max_length=100, blank=True, null=True)
    last = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    status = models.CharField(max_length=20, choices=PATIENT_STATUSES)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    # Relationships
    addresses = models.ManyToManyField(Address, blank=True)
    custom_fields = models.ManyToManyField(
        CustomFieldDefinition,
        through="PatientCustomField",
        blank=True,
    )
    studies = models.ManyToManyField(SleepStudy, blank=True)
    treatments = models.ManyToManyField(Treatment, blank=True)
    insurance = models.ManyToManyField(Insurance, blank=True)
    appointments = models.ManyToManyField(Visit, blank=True)

    def __str__(self):
        return f"{self.first} {self.last}"
