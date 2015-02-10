from google.appengine.ext import ndb
from core.models import BaseModel


class Objective(BaseModel):
    title = ndb.StringProperty()
    components = ndb.IntegerProperty(repeated=True)
    pyp = ndb.IntegerProperty()
    definition = ndb.StringProperty()
    target = ndb.StringProperty()

    @classmethod
    def get_all(cls):
        return Objective.query().fetch()

    @classmethod
    def create(cls, entity):
        if entity.title and entity.pyp:
            objective = Objective(
                title=entity.title,
                pyp=entity.pyp,
                definition=entity.definition,
                target=entity.target)
            objective.put()
            return objective
        else:
            return False

    @classmethod
    def update(cls, objective, entity):
        if objective:
            objective.title = entity.title
            objective.components = entity.components
            objective.definition = entity.definition
            objective.target = entity.target
            objective.put()
            return objective
        else:
            return False

    @classmethod
    def add_component(cls, request, component):
        objective = Objective.get_by_id(request.objective)
        if objective:
            objective.components.append(component.key.id())
            objective.put()
        return
