from google.appengine.ext import ndb

from core.models import BaseModel
from core.models import Variable
from core.models import Pyp


class Study(BaseModel):

    # Informacion Personal
    title = ndb.StringProperty(required=True)
    country = ndb.StringProperty()
    variables = ndb.KeyProperty(kind=Variable, repeated=True)
    pyps = ndb.KeyProperty(kind=Pyp, repeated=True)
    cells = ndb.IntegerProperty(repeated=True)

    @classmethod
    def query_all(cls):
        return Study.query().order(Study.creado).fetch()

    @classmethod
    def create(cls, title, variables=[], pyps=[]):
        if title:
            if variables:
                variables = [ndb.Key('Variable', variable) for variable in variables]
            if pyps:
                pyps = [ndb.Key('Pyp', pyp) for pyp in pyps]
            study = Study(title=title, variables=variables, pyps=pyps).put()
            return study
        return False

    @classmethod
    def update(cls, study, title, variables=[], pyps=[]):
        if study:
            study.title = title
            study.variables = [ndb.Key('Variable', variable) for variable in variables]
            study.pyps = [ndb.Key('Pyp', pyp) for pyp in pyps]
            study.put()
            return study
        else:
            return False

    @classmethod
    def add_cell(cls, request, cell):
        study = Study.get_by_id(request.study)
        if study:
            study.cells.append(cell.key.id())
            study.put()
        return
