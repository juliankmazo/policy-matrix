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

from objective_api_messages import ObjectiveRequest
from objective_api_messages import ObjectiveResponse
from objective_api_messages import ObjectiveListResponse

from component_api_messages import ComponentRequest
from component_api_messages import ComponentResponse
from component_api_messages import ComponentListResponse

from output_api_messages import OutputRequest
from output_api_messages import OutputResponse
from output_api_messages import OutputListResponse




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

Objective_resource = endpoints.ResourceContainer(
    ObjectiveRequest,
    id=messages.IntegerField(1, variant=messages.Variant.INT64, required=True)
)

Component_resource = endpoints.ResourceContainer(
    ComponentRequest,
    id=messages.IntegerField(1, variant=messages.Variant.INT64, required=True)
)

Output_resource = endpoints.ResourceContainer(
    OutputRequest,
    id=messages.IntegerField(1, variant=messages.Variant.INT64, required=True)
)
