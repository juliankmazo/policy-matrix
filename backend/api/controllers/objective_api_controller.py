import endpoints
from protorpc import message_types

from api import pmm_api
from api.controllers import BaseApiController
from api.helpers import ObjectiveApiHelper

from api.messages import ObjectiveListResponse
from api.messages import ObjectiveRequest
from api.messages import Objective_resource

from core.models import Objective
from core.models import Pyp
# from core.models import objectiveHelper


@pmm_api.api_class(resource_name='objectives', path='objectives')
class ObjectiveEndpoint(BaseApiController):

    @endpoints.method(message_types.VoidMessage, ObjectiveListResponse,
                      path='/objectives', http_method='GET', name='get_all')
    def get_objectives(self, request):
        objectives = Objective.get_all()
        return ObjectiveListResponse(
            objectives=[ObjectiveApiHelper().to_message(objective) for objective in objectives if objectives])

    @endpoints.method(Objective_resource, ObjectiveListResponse,
                      path='{id}', http_method='GET', name='get_one')
    def get_objective(self, request):
        objective = Objective.get_by_id(request.id)
        if not objective:
            raise endpoints.NotFoundException(
                "The objective ID: " + str(request.id) + " doesn't exist")
        return ObjectiveListResponse(
            objectives=[ObjectiveApiHelper().to_message(objective)])

    @endpoints.method(ObjectiveRequest, ObjectiveListResponse,
                      path='/objectives', http_method='POST', name='create')
    def create_objective(self, request):
        if not (request.title and request.pyp):
            raise endpoints.BadRequestException('title is required')
        objective = Objective.create(request)
        if not objective:
            raise endpoints.InternalServerErrorException('Something went wrong')
        Pyp.add_objective(request, objective)
        return ObjectiveListResponse(
            objectives=[ObjectiveApiHelper().to_message(objective)])

    @endpoints.method(Objective_resource, ObjectiveListResponse,
                      path='{id}', http_method='PUT', name='update')
    def update_objective(self, request):
        objective = Objective.get_by_id(request.id)
        if not objective:
            raise endpoints.NotFoundException(
                "The objective ID: " + str(request.id) + " doesn't exist")
        updated_objective = Objective.update(objective, request)
        if not updated_objective:
            raise endpoints.InternalServerErrorException('Something went wrong')
        return ObjectiveListResponse(
            objectives=[ObjectiveApiHelper().to_message(objective)])

    @endpoints.method(Objective_resource, message_types.VoidMessage,
                      path='{id}', http_method='DELETE', name='delete')
    def delete_objective(self, request):
        objective = Objective.get_by_id(request.id)
        if not objective:
            raise endpoints.NotFoundException(
                "The objective ID: " + str(request.id) + " doesn't exist")
        objective.key.delete()
        return message_types.VoidMessage()
