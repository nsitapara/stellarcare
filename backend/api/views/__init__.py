"""
This package provides view classes for the StellarCare application.
It implements a modular approach to views, organizing them by domain:
- Patient management
- Custom field configuration
- Medical records
- Administrative records

Features:
- RESTful API views
- Pagination support
- Search functionality
- Detailed logging
- Error handling
"""

from .base import CustomPagination  # noqa
from .custom_fields import (  # noqa
    CustomFieldDefinitionAssignedView,
    CustomFieldDefinitionAssignView,
    CustomFieldDefinitionListCreateView,
    CustomFieldDefinitionRetrieveUpdateDeleteView,
    PatientCustomFieldListView,
)
from .medical import (  # noqa
    SleepStudyDetailView,
    TreatmentDetailView,
)
from .patient import (  # noqa
    PatientListCreateView,
    PatientQueryView,
    PatientRetrieveUpdateDeleteView,
)
from .records import (  # noqa
    AppointmentDetailView,
    InsuranceDetailView,
)
