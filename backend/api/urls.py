"""
This module defines the URL routing configuration for the StellarCare application.

URL patterns are organized into logical groups:
1. API Documentation (Swagger/OpenAPI)
2. Authentication endpoints
3. User management
4. Patient management
5. Custom field configuration
6. Medical records
7. Administrative records

Features:
- RESTful API endpoints
- Token-based authentication
- Interactive API documentation
- Nested resource paths
- Named URL patterns for reverse lookup
"""

from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .api import UserViewSet
from .views import (
    AppointmentDetailView,
    CustomFieldDefinitionAssignedView,
    CustomFieldDefinitionAssignView,
    CustomFieldDefinitionListCreateView,
    CustomFieldDefinitionRetrieveUpdateDeleteView,
    InsuranceDetailView,
    PatientCustomFieldListView,
    PatientListCreateView,
    PatientQueryView,
    PatientRetrieveUpdateDeleteView,
    SleepStudyDetailView,
    TreatmentDetailView,
)

# Router configuration for viewsets
router = routers.DefaultRouter()
router.register("users", UserViewSet, basename="api-users")

# API Documentation endpoints
documentation_patterns = [
    path(
        "api/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
]

# Authentication endpoints
auth_patterns = [
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]

# Core application endpoints (users, router)
core_patterns = [
    path("api/", include(router.urls)),
    path("admin/", admin.site.urls),
]

# Patient management endpoints
patient_patterns = [
    path("api/patients/", PatientListCreateView.as_view(), name="patient-list-create"),
    path("api/patients/search/", PatientQueryView.as_view(), name="patient-search"),
    path(
        "api/patients/<str:pk>/",
        PatientRetrieveUpdateDeleteView.as_view(),
        name="patient-detail",
    ),
    path(
        "api/patients/<int:patient_id>/custom-fields/",
        PatientCustomFieldListView.as_view(),
        name="patient-custom-fields",
    ),
]

# Custom field configuration endpoints
custom_field_patterns = [
    path(
        "api/custom-field-definitions/",
        CustomFieldDefinitionListCreateView.as_view(),
        name="custom-field-definition-list-create",
    ),
    path(
        "api/custom-field-definitions/assigned/",
        CustomFieldDefinitionAssignedView.as_view(),
        name="custom-field-definition-assigned",
    ),
    path(
        "api/custom-field-definitions/<int:pk>/",
        CustomFieldDefinitionRetrieveUpdateDeleteView.as_view(),
        name="custom-field-definition-detail",
    ),
    path(
        "api/custom-field-definitions/<int:pk>/assign/",
        CustomFieldDefinitionAssignView.as_view(),
        name="custom-field-definition-assign",
    ),
]

# Medical and administrative record endpoints
record_patterns = [
    path(
        "api/appointments/<int:pk>/",
        AppointmentDetailView.as_view(),
        name="appointment-detail",
    ),
    path(
        "api/treatments/<int:pk>/",
        TreatmentDetailView.as_view(),
        name="treatment-detail",
    ),
    path(
        "api/sleep-studies/<int:pk>/",
        SleepStudyDetailView.as_view(),
        name="sleep-study-detail",
    ),
    path(
        "api/insurance/<int:pk>/",
        InsuranceDetailView.as_view(),
        name="insurance-detail",
    ),
]

# Combine all URL patterns
urlpatterns = (
    documentation_patterns
    + auth_patterns
    + core_patterns
    + patient_patterns
    + custom_field_patterns
    + record_patterns
)
