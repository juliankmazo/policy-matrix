"""
These messages are called when it initialises for accessing them more easily.
"""

import endpoints
from protorpc import messages
from protorpc import message_types

from study_api_messages import StudyRequest
from study_api_messages import StudyResponse
from study_api_messages import StudyListResponse

from variable_api_messages import VariableRequest
from variable_api_messages import VariableResponse
from variable_api_messages import VariableListResponse

from pyp_api_messages import PypRequest
from pyp_api_messages import PypResponse
from pyp_api_messages import PypListResponse



# This Resource container is created for reading parameters from the URL request

Study_resource = endpoints.ResourceContainer(
    StudyRequest,
    id=messages.IntegerField(1, variant=messages.Variant.INT64, required=True)
)

variable_resource = endpoints.ResourceContainer(
    VariableRequest,
    id=messages.IntegerField(1, variant=messages.Variant.INT64, required=True)
)

Pyp_resource = endpoints.ResourceContainer(
    PypRequest,
    id=messages.IntegerField(1, variant=messages.Variant.INT64, required=True)
)
