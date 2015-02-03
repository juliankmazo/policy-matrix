import endpoints

from api.controllers import StudyEndpoint
from api.controllers import VariableEndpoint

APPLICATION = endpoints.api_server([
                                    StudyEndpoint,
                                    VariableEndpoint
                                    ])
