"""
These messages are called when it initialises for accessing them more easily.
"""

import endpoints
from protorpc import messages
from protorpc import message_types

from client_api_messages import ClientRequest
from client_api_messages import ClientResponse
from client_api_messages import ClientListResponse

from study_api_messages import StudyRequest
from study_api_messages import StudyResponse
from study_api_messages import StudyListResponse


# This Resource container is created for reading parameters from the URL request
Client_resource = endpoints.ResourceContainer(
    ClientRequest,
    id=messages.IntegerField(1, variant=messages.Variant.INT64, required=True)
)

Study_resource = endpoints.ResourceContainer(
    StudyRequest,
    id=messages.IntegerField(1, variant=messages.Variant.INT64, required=True)
)
