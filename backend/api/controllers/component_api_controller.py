import endpoints
from protorpc import message_types

from api import pmm_api
from api.controllers import BaseApiController
from api.helpers import ComponentApiHelper

from api.messages import ComponentListResponse
from api.messages import ComponentRequest
from api.messages import Component_resource

from core.models import Component
from core.models import Objective
# from core.models import componentHelper


@pmm_api.api_class(resource_name='components', path='components')
class ComponentEndpoint(BaseApiController):

    @endpoints.method(message_types.VoidMessage, ComponentListResponse,
                      path='/components', http_method='GET', name='get_all')
    def get_components(self, request):
        components = Component.get_all()
        return ComponentListResponse(
            components=[ComponentApiHelper().to_message(component) for component in components if components])

    @endpoints.method(Component_resource, ComponentListResponse,
                      path='{id}', http_method='GET', name='get_one')
    def get_component(self, request):
        component = Component.get_by_id(request.id)
        if not component:
            raise endpoints.NotFoundException(
                "The component ID: " + str(request.id) + " doesn't exist")
        return ComponentListResponse(
            components=[ComponentApiHelper().to_message(component)])

    @endpoints.method(ComponentRequest, ComponentListResponse,
                      path='/components', http_method='POST', name='create')
    def create_component(self, request):
        if not (request.title and request.objective):
            raise endpoints.BadRequestException('title is required')
        component = Component.create(request)
        if not component:
            raise endpoints.InternalServerErrorException('Something went wrong')
        Objective.add_component(request, component)
        return ComponentListResponse(
            components=[ComponentApiHelper().to_message(component)])

    @endpoints.method(Component_resource, ComponentListResponse,
                      path='{id}', http_method='PUT', name='update')
    def update_component(self, request):
        component = Component.get_by_id(request.id)
        if not component:
            raise endpoints.NotFoundException(
                "The component ID: " + str(request.id) + " doesn't exist")
        updated_component = component.update(component, request)
        if not updated_component:
            raise endpoints.InternalServerErrorException('Something went wrong')
        return ComponentListResponse(
            components=[ComponentApiHelper().to_message(component)])

    @endpoints.method(Component_resource, message_types.VoidMessage,
                      path='{id}', http_method='DELETE', name='delete')
    def delete_component(self, request):
        component = component.get_by_id(request.id)
        if not component:
            raise endpoints.NotFoundException(
                "The component ID: " + str(request.id) + " doesn't exist")
        component.key.delete()
        return message_types.VoidMessage()
