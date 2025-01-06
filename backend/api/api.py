"""
This module provides the REST API endpoints for user management in the StellarCare application.
It implements a ViewSet for handling user-related operations including:
- User registration
- Profile management
- Password changes
- Account deletion

The API is built using Django REST Framework and includes:
- Serializer-based validation
- Permission-based access control
- Swagger/OpenAPI documentation via drf-spectacular
- Token-based authentication
"""

from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .serializers import (
    UserChangePasswordErrorSerializer,
    UserChangePasswordSerializer,
    UserCreateErrorSerializer,
    UserCreateSerializer,
    UserCurrentErrorSerializer,
    UserCurrentSerializer,
)

User = get_user_model()


class UserViewSet(
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    """
    ViewSet for managing user accounts and authentication.

    This ViewSet provides endpoints for:
    - User registration (POST /)
    - Current user profile (GET/PUT/PATCH /me)
    - Password changes (POST /change-password)
    - Account deletion (DELETE /delete-account)

    Authentication is required for all endpoints except user registration.
    All responses are properly serialized and validated using dedicated serializers.
    """

    queryset = User.objects.all()
    serializer_class = UserCurrentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Restricts the queryset to only return the current user's data.
        This ensures users can only access their own information.
        """
        return self.queryset.filter(pk=self.request.user.pk)

    def get_permissions(self):
        """
        Configures endpoint-specific permissions:
        - User registration (create) is open to all
        - All other endpoints require authentication
        """
        if self.action == "create":
            return [AllowAny()]

        return super().get_permissions()

    def get_serializer_class(self):
        """
        Returns the appropriate serializer based on the current action:
        - create: UserCreateSerializer for registration
        - me: UserCurrentSerializer for profile management
        - change_password: UserChangePasswordSerializer for password updates
        """
        if self.action == "create":
            return UserCreateSerializer
        elif self.action == "me":
            return UserCurrentSerializer
        elif self.action == "change_password":
            return UserChangePasswordSerializer

        return super().get_serializer_class()

    @extend_schema(
        responses={
            200: UserCreateSerializer,
            400: UserCreateErrorSerializer,
        }
    )
    def create(self, request, *args, **kwargs):
        """
        Handles user registration.

        Creates a new user account with the provided credentials.
        The account is automatically activated upon creation.

        Returns:
            201: Newly created user data
            400: Validation errors
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # Auto-activate new users - this can be modified based on requirements
        # e.g., email verification could be added here
        user.is_active = True
        user.save()
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    @extend_schema(
        responses={
            200: UserCurrentSerializer,
            400: UserCurrentErrorSerializer,
        }
    )
    @action(["get", "put", "patch"], detail=False)
    def me(self, request, *args, **kwargs):
        """
        Endpoint for managing the current user's profile.

        Supports:
        - GET: Retrieve current user's profile
        - PUT: Full update of user profile
        - PATCH: Partial update of user profile

        All operations are restricted to the authenticated user's own data.
        """
        if request.method == "GET":
            serializer = self.get_serializer(self.request.user)
            return Response(serializer.data)
        elif request.method == "PUT":
            # Full update - all fields required
            serializer = self.get_serializer(
                self.request.user, data=request.data, partial=False
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        elif request.method == "PATCH":
            # Partial update - only specified fields updated
            serializer = self.get_serializer(
                self.request.user, data=request.data, partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

    @extend_schema(
        responses={
            204: None,
            400: UserChangePasswordErrorSerializer,
        }
    )
    @action(["post"], url_path="change-password", detail=False)
    def change_password(self, request, *args, **kwargs):
        """
        Endpoint for changing the user's password.

        Validates the new password using the UserChangePasswordSerializer
        which ensures password complexity requirements are met.

        Returns:
            204: Password successfully changed
            400: Validation errors (e.g., password too weak)
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.request.user.set_password(serializer.data["password_new"])
        self.request.user.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(["delete"], url_path="delete-account", detail=False)
    def delete_account(self, request, *args, **kwargs):
        """
        Endpoint for account deletion.

        Permanently deletes the user's account and all associated data.
        This action cannot be undone.

        Returns:
            204: Account successfully deleted
        """
        self.request.user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
