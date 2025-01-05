from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils.translation import gettext_lazy as _
from rest_framework import exceptions, serializers

from .models import (
    Address,
    CustomFieldDefinition,
    Insurance,
    Patient,
    PatientCustomField,
    SleepStudy,
    Treatment,
    Visits,
)

User = get_user_model()


class UserCurrentSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "first_name", "last_name"]


class UserCurrentErrorSerializer(serializers.Serializer):
    username = serializers.ListSerializer(child=serializers.CharField(), required=False)
    first_name = serializers.ListSerializer(
        child=serializers.CharField(), required=False
    )
    last_name = serializers.ListSerializer(
        child=serializers.CharField(), required=False
    )


class UserChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(style={"input_type": "password"}, write_only=True)
    password_new = serializers.CharField(style={"input_type": "password"})
    password_retype = serializers.CharField(
        style={"input_type": "password"}, write_only=True
    )

    default_error_messages = {
        "password_mismatch": _("Current password is not matching"),
        "password_invalid": _("Password does not meet all requirements"),
        "password_same": _("Both new and current passwords are same"),
    }

    class Meta:
        model = User
        fields = ["password", "password_new", "password_retype"]

    def validate(self, attrs):
        request = self.context.get("request", None)

        if not request.user.check_password(attrs["password"]):
            raise serializers.ValidationError(
                {"password": self.default_error_messages["password_mismatch"]}
            )

        try:
            validate_password(attrs["password_new"])
        except ValidationError as e:
            raise exceptions.ValidationError({"password_new": list(e.messages)}) from e

        if attrs["password_new"] != attrs["password_retype"]:
            raise serializers.ValidationError(
                {"password_retype": self.default_error_messages["password_invalid"]}
            )

        if attrs["password_new"] == attrs["password"]:
            raise serializers.ValidationError(
                {"password_new": self.default_error_messages["password_same"]}
            )
        return super().validate(attrs)


class UserChangePasswordErrorSerializer(serializers.Serializer):
    password = serializers.ListSerializer(child=serializers.CharField(), required=False)
    password_new = serializers.ListSerializer(
        child=serializers.CharField(), required=False
    )
    password_retype = serializers.ListSerializer(
        child=serializers.CharField(), required=False
    )


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(style={"input_type": "password"}, write_only=True)
    password_retype = serializers.CharField(
        style={"input_type": "password"}, write_only=True
    )

    default_error_messages = {
        "password_mismatch": _("Password are not matching."),
        "password_invalid": _("Password does not meet all requirements."),
    }

    class Meta:
        model = User
        fields = ["username", "password", "password_retype"]

    def validate(self, attrs):
        password_retype = attrs.pop("password_retype")

        try:
            validate_password(attrs.get("password"))
        except exceptions.ValidationError:
            self.fail("password_invalid")

        if attrs["password"] == password_retype:
            return attrs

        return self.fail("password_mismatch")

    def create(self, validated_data):
        with transaction.atomic():
            user = User.objects.create_user(**validated_data)

            # By default newly registered accounts are inactive.
            user.is_active = False
            user.save(update_fields=["is_active"])

        return user


class UserCreateErrorSerializer(serializers.Serializer):
    username = serializers.ListSerializer(child=serializers.CharField(), required=False)
    password = serializers.ListSerializer(child=serializers.CharField(), required=False)
    password_retype = serializers.ListSerializer(
        child=serializers.CharField(), required=False
    )


class AddressSerializer(serializers.ModelSerializer):
    formatted_address = serializers.SerializerMethodField()

    class Meta:
        model = Address
        fields = ["id", "street", "city", "state", "zip_code", "formatted_address"]

    def get_formatted_address(self, obj):
        return str(obj)


class CustomFieldDefinitionSerializer(serializers.ModelSerializer):
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
    field_definition = CustomFieldDefinitionSerializer(read_only=True)
    value = serializers.SerializerMethodField()

    class Meta:
        model = PatientCustomField
        fields = ["id", "field_definition", "value"]

    def get_value(self, obj):
        return obj.get_value()


class PatientSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True)
    custom_fields = serializers.ListField(
        child=serializers.DictField(), write_only=True, required=False
    )
    patient_custom_fields = PatientCustomFieldSerializer(many=True, read_only=True)

    class Meta:
        model = Patient
        fields = "__all__"
        read_only_fields = ("id",)

    def create(self, validated_data):
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
                    custom_field = PatientCustomField.objects.create(
                        patient=patient,
                        field_definition=field_definition,
                        **{value_field: value},
                    )
                    print(f"Created patient custom field: {custom_field.id}")
            except CustomFieldDefinition.DoesNotExist:
                continue
            except Exception:
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


class VisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visits
        fields = ["id", "date", "time", "type", "status", "notes", "zoom_link"]


class TreatmentSerializer(serializers.ModelSerializer):
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


class SleepStudySerializer(serializers.ModelSerializer):
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


class InsuranceSerializer(serializers.ModelSerializer):
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
