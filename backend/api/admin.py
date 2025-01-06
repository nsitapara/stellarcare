"""
This module configures the Django admin interface for the StellarCare application.
It provides customized admin views for all major models in the system, with features including:
- Custom list displays and filters
- Search functionality
- Date hierarchies where applicable
- Specialized user management
- Custom field handling

Each admin class is configured with appropriate:
- List displays for quick overview
- Filters for data segmentation
- Search fields for quick access
- Date hierarchies for temporal navigation
- Custom form handling where needed

The admin interface uses the Unfold admin theme for an enhanced user experience
and better visual organization of the data.
"""

from django.contrib import admin
from django.contrib.auth.admin import GroupAdmin as BaseGroupAdmin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from unfold.admin import ModelAdmin
from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm

from .models import (
    Address,
    CustomFieldDefinition,
    Insurance,
    Patient,
    PatientCustomField,
    SleepStudy,
    Treatment,
    User,
    Visit,
)

admin.site.unregister(Group)


@admin.register(User)
class UserAdmin(BaseUserAdmin, ModelAdmin):
    """
    Admin interface for User management.

    Extends the base Django user admin with additional functionality for:
    - Custom field management
    - Enhanced permission handling
    - Specialized form handling for user creation and modification

    Features:
    - Custom forms for user creation and modification
    - Specialized password change handling
    - Filtered views of user permissions and groups
    - Management of available custom fields
    """

    form = UserChangeForm
    add_form = UserCreationForm
    change_password_form = AdminPasswordChangeForm
    list_display = ["username", "email", "first_name", "last_name", "is_staff"]
    search_fields = ["username", "email", "first_name", "last_name"]
    ordering = ["username"]
    filter_horizontal = ["available_custom_fields", "groups", "user_permissions"]
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name", "email")}),
        ("Custom Fields", {"fields": ("available_custom_fields",)}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )


@admin.register(Group)
class GroupAdmin(BaseGroupAdmin, ModelAdmin):
    """
    Admin interface for Group management.
    Extends the base Django group admin with Unfold theme integration.
    """

    pass


@admin.register(Patient)
class PatientAdmin(ModelAdmin):
    """
    Admin interface for Patient management.

    Provides comprehensive patient information management with:
    - Basic demographic information display
    - Patient status tracking
    - Creation time monitoring
    - Hierarchical date-based navigation
    """

    list_display = ["id", "first", "last", "date_of_birth", "status", "created_at"]
    list_filter = ["status", "created_at"]
    search_fields = ["first", "last", "id"]
    ordering = ["-created_at"]
    date_hierarchy = "created_at"


@admin.register(CustomFieldDefinition)
class CustomFieldDefinitionAdmin(ModelAdmin):
    """
    Admin interface for Custom Field Definition management.

    Handles the creation and management of custom fields with:
    - Field type specification
    - Activity status tracking
    - Requirement settings
    - Display order management
    """

    list_display = ["name", "type", "is_active", "is_required", "display_order"]
    list_filter = ["type", "is_active", "is_required"]
    search_fields = ["name", "description"]
    ordering = ["display_order", "name"]


@admin.register(PatientCustomField)
class PatientCustomFieldAdmin(ModelAdmin):
    """
    Admin interface for Patient Custom Field values.

    Manages the individual custom field values for patients with:
    - Patient-field associations
    - Value tracking
    - Creation time monitoring
    - Field type filtering
    """

    list_display = ["patient", "field_definition", "get_value", "created_at"]
    list_filter = ["field_definition__type", "field_definition"]
    search_fields = ["patient__first", "patient__last", "field_definition__name"]
    raw_id_fields = ["patient", "field_definition"]
    date_hierarchy = "created_at"


@admin.register(Address)
class AddressAdmin(ModelAdmin):
    """
    Admin interface for Address management.

    Handles patient address information with:
    - Full address component display
    - Geographic filtering
    - Comprehensive search capabilities
    """

    list_display = ["street", "city", "state", "zip_code"]
    list_filter = ["state", "city"]
    search_fields = ["street", "city", "state", "zip_code"]


@admin.register(SleepStudy)
class SleepStudyAdmin(ModelAdmin):
    """
    Admin interface for Sleep Study management.

    Tracks sleep study results with:
    - Key metrics display (AHI, efficiency, REM latency)
    - Date-based navigation
    - Notes search capability
    """

    list_display = ["date", "ahi", "sleep_efficiency", "rem_latency"]
    list_filter = ["date"]
    search_fields = ["notes"]
    date_hierarchy = "date"


@admin.register(Treatment)
class TreatmentAdmin(ModelAdmin):
    """
    Admin interface for Treatment management.

    Handles patient treatment information with:
    - Treatment details display
    - Time period tracking
    - Type-based filtering
    - Comprehensive search options
    """

    list_display = ["name", "type", "dosage", "frequency", "start_date", "end_date"]
    list_filter = ["type", "start_date"]
    search_fields = ["name", "type", "notes"]
    date_hierarchy = "start_date"


@admin.register(Insurance)
class InsuranceAdmin(ModelAdmin):
    """
    Admin interface for Insurance management.

    Manages insurance information with:
    - Policy and authorization details
    - Provider filtering
    - Status tracking
    - Expiry date monitoring
    """

    list_display = [
        "provider",
        "policy_number",
        "primary_holder",
        "authorization_status",
        "authorization_expiry",
    ]
    list_filter = ["provider", "authorization_status"]
    search_fields = ["provider", "policy_number", "primary_holder"]
    date_hierarchy = "authorization_expiry"


@admin.register(Visit)
class VisitsAdmin(ModelAdmin):
    """
    Admin interface for Visit management.

    Handles patient visit scheduling and tracking with:
    - Appointment details display
    - Visit type and status filtering
    - Date-based navigation
    - Notes search capability
    """

    list_display = ["date", "time", "type", "status"]
    list_filter = ["type", "status", "date"]
    search_fields = ["notes"]
    date_hierarchy = "date"
