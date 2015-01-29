import endpoints

from api.controllers import ClientEndpoint
from api.controllers import StudyEndpoint

APPLICATION = endpoints.api_server([
                                    StudyEndpoint
                                    ])
