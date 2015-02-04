import endpoints
from protorpc import message_types

from api import pmm_api
from api.controllers import BaseApiController
from api.helpers import PypApiHelper

from api.messages import PypListResponse
from api.messages import PypRequest
from api.messages import Pyp_resource

from core.models import Pyp
# from core.models import PypHelper


@pmm_api.api_class(resource_name='pyps', path='pyps')
class PypEndpoint(BaseApiController):

    @endpoints.method(message_types.VoidMessage, PypListResponse,
                      path='/pyps', http_method='GET', name='get_all')
    def get_pyps(self, request):
        pyps = Pyp.get_all()
        return PypListResponse(
            pyps=[PypApiHelper().to_message(pyp) for pyp in pyps if pyps])

    @endpoints.method(Pyp_resource, PypListResponse,
                      path='{id}', http_method='GET', name='get_one')
    def get_pyp(self, request):
        pyp = Pyp.get_by_id(request.id)
        if not pyp:
            raise endpoints.NotFoundException(
                "The policy or program ID: " + str(request.id) + " doesn't exist")
        return PypListResponse(
            pyps=[PypApiHelper().to_message(pyp)])

    @endpoints.method(PypRequest, PypListResponse,
                      path='/pyps', http_method='POST', name='create')
    def create_pyp(self, request):
        if not (request.title and request.country):
            raise endpoints.BadRequestException('Title and country are required')
        pyp = Pyp.create(request)
        if not pyp:
            raise endpoints.InternalServerErrorException('Something went wrong')
        return PypListResponse(
            pyps=[PypApiHelper().to_message(pyp)])

    @endpoints.method(Pyp_resource, PypListResponse,
                      path='{id}', http_method='PUT', name='update')
    def update_pyp(self, request):
        pyp = Pyp.get_by_id(request.id)
        if not pyp:
            raise endpoints.NotFoundException(
                "The policy or program ID: " + str(request.id) + " doesn't exist")
        updated_pyp = Pyp.update(pyp, request)
        if not updated_pyp:
            raise endpoints.InternalServerErrorException('Something went wrong')
        return PypListResponse(
            pyps=[PypApiHelper().to_message(pyp)])

    @endpoints.method(Pyp_resource, message_types.VoidMessage,
                      path='{id}', http_method='DELETE', name='delete')
    def delete_pyp(self, request):
        pyp = Pyp.get_by_id(request.id)
        if not pyp:
            raise endpoints.NotFoundException(
                "The policy or program ID: " + str(request.id) + " doesn't exist")
        pyp.key.delete()
        return message_types.VoidMessage()
