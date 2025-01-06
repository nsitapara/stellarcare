"""
This module provides base classes and common functionality for views.

Features:
- Custom pagination
- Response formatting
- Logging configuration
- Common utilities
"""

import logging

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

logger = logging.getLogger(__name__)


class CustomPagination(PageNumberPagination):
    """
    Custom pagination class for consistent pagination across views.

    Features:
    - Configurable page size
    - Maximum page size limit
    - Detailed pagination metadata
    - Logging of pagination details

    Default Configuration:
    - Page size: 10 items
    - Maximum page size: 100 items
    - Query parameter: page_size
    """

    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100

    def get_paginated_response(self, data):
        """
        Returns a paginated response with metadata.

        Includes:
        - Total count of items
        - Next page link
        - Previous page link
        - Current page results

        Also logs pagination details for monitoring.
        """
        logger.info(
            f"Pagination: page={self.page.number}, page_size={self.page_size}, total={self.page.paginator.count}"
        )
        return Response(
            {
                "count": self.page.paginator.count,
                "next": self.get_next_link(),
                "previous": self.get_previous_link(),
                "results": data,
            }
        )
