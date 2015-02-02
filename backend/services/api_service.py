import endpoints

from api.controllers import StudyEndpoint

APPLICATION = endpoints.api_server([
                                    StudyEndpoint
                                    ])
