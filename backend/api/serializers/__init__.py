"""
This package provides serializers for the StellarCare application.
It implements a modular approach to serialization, organizing serializers by domain:
- User management and authentication
- Patient information and records
- Medical data (treatments, studies)
- Administrative data (visits, insurance)
"""

from .auth import (  # noqa
    UserChangePasswordErrorSerializer,
    UserChangePasswordSerializer,
    UserCreateErrorSerializer,
    UserCreateSerializer,
    UserCurrentErrorSerializer,
    UserCurrentSerializer,
)
from .medical import (  # noqa
    SleepStudySerializer,
    TreatmentSerializer,
)
from .patient import (  # noqa
    AddressSerializer,
    CustomFieldDefinitionSerializer,
    PatientCustomFieldSerializer,
    PatientSerializer,
)
from .records import (  # noqa
    InsuranceSerializer,
    VisitSerializer,
)
