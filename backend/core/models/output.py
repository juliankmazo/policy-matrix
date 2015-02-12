from google.appengine.ext import ndb
from core.models import BaseModel


class Output(BaseModel):
    title = ndb.StringProperty()
    objective = ndb.IntegerProperty()
    description = ndb.StringProperty()
    baseline = ndb.StringProperty()
    target = ndb.StringProperty()

    @classmethod
    def get_all(cls):
        return Output.query().fetch()

    @classmethod
    def create(cls, entity):
        if entity.title and entity.objective:
            output = Output(
                title=entity.title,
                objective=entity.objective,
                description=entity.description,
                baseline=entity.baseline,
                target=entity.target)
            output.put()
            return output
        else:
            return False

    @classmethod
    def update(cls, output, entity):
        if output:
            output.title = entity.title
            output.description = entity.description
            output.baseline = entity.baseline
            output.target = entity.target
            output.put()
            return output
        else:
            return False

