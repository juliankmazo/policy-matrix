import endpoints
from protorpc import message_types

from api import pmm_api
from api.controllers import BaseApiController
from api.helpers import CellApiHelper

from api.messages import CellListResponse
from api.messages import CellRequest
from api.messages import Cellresource

from core.models import Cell
from core.models import Study


@pmm_api.api_class(resource_name='cells', path='cells')
class CellEndpoint(BaseApiController):

    @endpoints.method(CellRequest, CellListResponse,
                      path='/cells', http_method='GET', name='get_all')
    def get_cells(self, request):
        cells = Cell.query()
        if request.study and request.variable and request.output and request.scoreIndex:
            cells = cells.filter(Cell.study == request.study)
            cells = cells.filter(Cell.variable == request.variable)
            cells = cells.filter(Cell.output == request.output)
            cells = cells.filter(Cell.scoreIndex == request.scoreIndex)
        cells = cells.fetch()
        return CellListResponse(
            cells=[CellApiHelper().to_message(cell) for cell in cells if cells])

    @endpoints.method(Cellresource, CellListResponse,
                      path='{id}', http_method='GET', name='get_one')
    def get_cell(self, request):
        cell = Cell.get_by_id(request.id)
        if not cell:
            raise endpoints.NotFoundException(
                "The cell ID: " + str(request.id) + " doesn't exist")
        return CellListResponse(
            cells=[CellApiHelper().to_message(cell)])

    @endpoints.method(CellRequest, CellListResponse,
                      path='/cells', http_method='POST', name='create')
    def create_cell(self, request):
        if not request.study and request.score >= 0:
            raise endpoints.BadRequestException('score is required')
        cell = Cell.create(request)
        if not cell:
            raise endpoints.InternalServerErrorException('Something went wrong')
        Study.add_cell(request, cell)
        return CellListResponse(
            cells=[CellApiHelper().to_message(cell)])

    @endpoints.method(Cellresource, CellListResponse,
                      path='{id}', http_method='PUT', name='update')
    def update_cell(self, request):
        cell = Cell.get_by_id(request.id)
        if not cell:
            raise endpoints.NotFoundException(
                "The cell ID: " + str(request.id) + " doesn't exist")
        updated_cell = Cell.update(cell, request)
        if not updated_cell:
            raise endpoints.InternalServerErrorException('Something went wrong')
        return CellListResponse(
            cells=[CellApiHelper().to_message(cell)])

    @endpoints.method(Cellresource, message_types.VoidMessage,
                      path='{id}', http_method='DELETE', name='delete')
    def delete_cell(self, request):
        cell = Cell.get_by_id(request.id)
        if not cell:
            raise endpoints.NotFoundException(
                "The cell ID: " + str(request.id) + " doesn't exist")
        cell.key.delete()
        return message_types.VoidMessage()
