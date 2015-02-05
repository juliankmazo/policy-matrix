from google.appengine.ext import ndb
from core.models import BaseModel


class Objective(BaseModel):
    title = ndb.StringProperty()
    subobj = ndb.IntegerProperty(repeated=True)
    pyp = ndb.IntegerProperty()

    @classmethod
    def get_all(cls):
        return Objective.query().fetch()

    @classmethod
    def create(cls, entity):
        if entity.title and entity.pyp:
            objective = Objective(
                title=entity.title,
                pyp=entity.pyp)
            objective.put()
            return objective
        else:
            return False

    @classmethod
    def update(cls, objective, entity):
        if objective:
            if entity.title:
                objective.title = entity.title
            if entity.subObj:
                objective.subobj = entity.subObj
            objective.put()
            return objective
        else:
            return False

