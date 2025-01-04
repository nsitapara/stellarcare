from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .api import UserViewSet
from .views import (
    PatientListCreateView,
    PatientQueryView,
    PatientRetrieveUpdateDeleteView,
)

router = routers.DefaultRouter()
router.register("users", UserViewSet, basename="api-users")

urlpatterns = [
    path(
        "api/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
    ),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/", include(router.urls)),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("admin/", admin.site.urls),
    path("api/patients/", PatientListCreateView.as_view(), name="patient-list-create"),
    path("api/patients/search/", PatientQueryView.as_view(), name="patient-search"),
    path(
        "api/patients/<str:pk>/",
        PatientRetrieveUpdateDeleteView.as_view(),
        name="patient-detail",
    ),
]
