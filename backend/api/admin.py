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
    pass


@admin.register(Patient)
class PatientAdmin(ModelAdmin):
    list_display = ["id", "first", "last", "date_of_birth", "status", "created_at"]
    list_filter = ["status", "created_at"]
    search_fields = ["first", "last", "id"]
    ordering = ["-created_at"]
    date_hierarchy = "created_at"


@admin.register(CustomFieldDefinition)
class CustomFieldDefinitionAdmin(ModelAdmin):
    list_display = ["name", "type", "is_active", "is_required", "display_order"]
    list_filter = ["type", "is_active", "is_required"]
    search_fields = ["name", "description"]
    ordering = ["display_order", "name"]


@admin.register(PatientCustomField)
class PatientCustomFieldAdmin(ModelAdmin):
    list_display = ["patient", "field_definition", "get_value", "created_at"]
    list_filter = ["field_definition__type", "field_definition"]
    search_fields = ["patient__first", "patient__last", "field_definition__name"]
    raw_id_fields = ["patient", "field_definition"]
    date_hierarchy = "created_at"


@admin.register(Address)
class AddressAdmin(ModelAdmin):
    list_display = ["street", "city", "state", "zip_code"]
    list_filter = ["state", "city"]
    search_fields = ["street", "city", "state", "zip_code"]


@admin.register(SleepStudy)
class SleepStudyAdmin(ModelAdmin):
    list_display = ["date", "ahi", "sleep_efficiency", "rem_latency"]
    list_filter = ["date"]
    search_fields = ["notes"]
    date_hierarchy = "date"


@admin.register(Treatment)
class TreatmentAdmin(ModelAdmin):
    list_display = ["name", "type", "dosage", "frequency", "start_date", "end_date"]
    list_filter = ["type", "start_date"]
    search_fields = ["name", "type", "notes"]
    date_hierarchy = "start_date"


@admin.register(Insurance)
class InsuranceAdmin(ModelAdmin):
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
    list_display = ["date", "time", "type", "status"]
    list_filter = ["type", "status", "date"]
    search_fields = ["notes"]
    date_hierarchy = "date"
