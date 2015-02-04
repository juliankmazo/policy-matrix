import endpoints
from protorpc import message_types

from api import pmm_api
from api.controllers import BaseApiController
from api.helpers import StudyApiHelper

from api.messages import StudyListResponse
from api.messages import StudyRequest
from api.messages import Study_resource

from core.models import Study
from core.helpers import StudyHelper


@pmm_api.api_class(resource_name='studies', path='studies')
class StudyEndpoint(BaseApiController):

    @endpoints.method(message_types.VoidMessage, StudyListResponse,
                      path='/studies', http_method='GET',
                      name='get_all')
    def get_studies(self, request):
        studies = Study.query().fetch()
        return StudyListResponse(
          studies=[StudyApiHelper().to_message(study) for study in studies if studies])

    @endpoints.method(Study_resource, StudyListResponse,
                      path='{id}', http_method='GET',
                      name='get_one')
    def get_study(self, request):
        study = Study.get_by_id(request.id)
        if not study:
            raise endpoints.NotFoundException(
              "The study ID: " + str(request.id) + " doesn't exist")
        return StudyListResponse(studies=[StudyApiHelper().to_message(study)])

    @endpoints.method(StudyRequest, StudyListResponse,
                      path='/studies', http_method='POST',
                      name='create')
    def create_study(self, request):
        if not (request.title and request.country):
            raise endpoints.BadRequestException('The data: title, country are obligatory.')
        study = StudyHelper.create(request.title, request.country)
        if not study:
            raise endpoints.BadRequestException('It was not possible to create the study')
        return StudyListResponse(studies=[StudyApiHelper().to_message(study.get())])

    @endpoints.method(Study_resource, StudyListResponse,
                      path='{id}', http_method='PUT',
                      name='update')
    def update_study(self, request):
        study = Study.get_by_id(request.id)
        if not study:
            raise endpoints.NotFoundException(
              "The study ID: " + str(request.id) + " doesn't exist")
        if not (request.title and request.country):
            raise endpoints.BadRequestException('The data: title, country are obligatory.')
        study = StudyHelper.update(study.key, request.title, request.country)
        if not study:
            raise endpoints.BadRequestException('It was not possible to create the study')
        return StudyListResponse(studies=[StudyApiHelper().to_message(study.get())])

    @endpoints.method(Study_resource, message_types.VoidMessage,
                      path='{id}', http_method='DELETE',
                      name='delete')
    def delete_study(self, request):
        study = Study.get_by_id(request.id)
        if not study:
            raise endpoints.NotFoundException(
              "The study ID: " + str(request.id) + " doesn't exist")
        study.key.delete()
        return message_types.VoidMessage()
