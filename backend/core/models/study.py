from google.appengine.ext import ndb

from core.models import BaseModel
from core.models import Variable


class Study(BaseModel):

    # Informacion Personal
    title = ndb.StringProperty(required=True)
    country = ndb.StringProperty()
    variables = ndb.KeyProperty(kind=Variable, repeated=True)

    @classmethod
    def query_all(cls):
        return Study.query().order(Study.creado).fetch()

    @classmethod
    def create(cls, title, variables=[]):
        if title:
            if variables:
                variables = [ndb.Key('Variable', variable) for variable in variables]
            study = Study(title=title, variables=variables).put()
            return study
        return False

    @classmethod
    def update(cls, study, title, variables=[]):
        if study:
            if title:
                study.title = title
            if variables:
                study.variables = [ndb.Key('Variable', variable) for variable in variables]
            study.put()
            return study
        else:
            return False
