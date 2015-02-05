import endpoints

from api.controllers import StudyEndpoint
from api.controllers import VariableEndpoint
from api.controllers import PypEndpoint
from api.controllers import ObjectiveEndpoint

APPLICATION = endpoints.api_server([
                                    StudyEndpoint,
                                    VariableEndpoint,
                                    PypEndpoint,
                                    ObjectiveEndpoint
                                    ])
