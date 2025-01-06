"""
This module provides serializers for user authentication and management.

It implements serializers for:
- User registration
- Profile management
- Password changes
- Error handling

Features:
- Password validation and complexity checks
- Error message localization
- Atomic transactions for user creation
- Secure password handling
"""

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils.translation import gettext_lazy as _
from rest_framework import exceptions, serializers

User = get_user_model()


class UserCurrentSerializer(serializers.ModelSerializer):
    """
    Serializer for current user profile operations.
    Used for retrieving and updating the authenticated user's information.
    """

    class Meta:
        model = User
        fields = ["username", "first_name", "last_name"]


class UserCurrentErrorSerializer(serializers.Serializer):
    """Error serializer for current user operations."""

    username = serializers.ListSerializer(child=serializers.CharField(), required=False)
    first_name = serializers.ListSerializer(
        child=serializers.CharField(), required=False
    )
    last_name = serializers.ListSerializer(
        child=serializers.CharField(), required=False
    )


class UserChangePasswordSerializer(serializers.ModelSerializer):
    """
    Serializer for password change operations.

    Implements comprehensive password validation:
    - Current password verification
    - New password complexity requirements
    - Password confirmation matching
    - Prevention of password reuse
    """

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
        """
        Validates the password change request:
        1. Verifies current password
        2. Validates new password complexity
        3. Ensures new password matches confirmation
        4. Prevents reuse of current password
        """
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
    """Error serializer for password change operations."""

    password = serializers.ListSerializer(child=serializers.CharField(), required=False)
    password_new = serializers.ListSerializer(
        child=serializers.CharField(), required=False
    )
    password_retype = serializers.ListSerializer(
        child=serializers.CharField(), required=False
    )


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.

    Features:
    - Password complexity validation
    - Password confirmation
    - Atomic transaction for user creation
    - Default inactive status for new accounts
    """

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
        """
        Validates the registration request:
        1. Validates password complexity
        2. Ensures password matches confirmation
        """
        password_retype = attrs.pop("password_retype")

        try:
            validate_password(attrs.get("password"))
        except exceptions.ValidationError:
            self.fail("password_invalid")

        if attrs["password"] == password_retype:
            return attrs

        return self.fail("password_mismatch")

    def create(self, validated_data):
        """
        Creates a new user account:
        - Uses atomic transaction
        - Sets initial inactive status
        - Properly hashes password
        """
        with transaction.atomic():
            user = User.objects.create_user(**validated_data)
            user.is_active = False
            user.save(update_fields=["is_active"])
        return user


class UserCreateErrorSerializer(serializers.Serializer):
    """Error serializer for user registration."""

    username = serializers.ListSerializer(child=serializers.CharField(), required=False)
    password = serializers.ListSerializer(child=serializers.CharField(), required=False)
    password_retype = serializers.ListSerializer(
        child=serializers.CharField(), required=False
    )
