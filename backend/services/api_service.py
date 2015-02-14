import endpoints

from api.controllers import StudyEndpoint
from api.controllers import VariableEndpoint
from api.controllers import PypEndpoint
from api.controllers import ObjectiveEndpoint
from api.controllers import OutputEndpoint
from api.controllers import CellEndpoint

APPLICATION = endpoints.api_server([
                                    StudyEndpoint,
                                    VariableEndpoint,
                                    PypEndpoint,
                                    ObjectiveEndpoint,
                                    OutputEndpoint,
                                    CellEndpoint
                                    ])
