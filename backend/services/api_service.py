import endpoints

from api.controllers import StudyEndpoint
from api.controllers import VariableEndpoint
from api.controllers import PypEndpoint

APPLICATION = endpoints.api_server([
                                    StudyEndpoint,
                                    VariableEndpoint,
                                    PypEndpoint
                                    ])
