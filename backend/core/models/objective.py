from google.appengine.ext import ndb
from core.models import BaseModel


class Objective(BaseModel):
    title = ndb.StringProperty()
    outputs = ndb.IntegerProperty(repeated=True)
    pyp = ndb.IntegerProperty()
    description = ndb.StringProperty()
    baseline = ndb.StringProperty()
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
                description=entity.description,
                baseline=entity.baseline,
                target=entity.target)
            objective.put()
            return objective
        else:
            return False

    @classmethod
    def update(cls, objective, entity):
        if objective:
            objective.title = entity.title
            if entity.outputs:
                objective.outputs = entity.outputs
            objective.description = entity.description
            objective.baseline = entity.baseline
            objective.target = entity.target
            objective.put()
            return objective
        else:
            return False

    @classmethod
    def add_output(cls, request, output):
        objective = Objective.get_by_id(request.objective)
        if objective:
            objective.outputs.append(output.key.id())
            objective.put()
        return
