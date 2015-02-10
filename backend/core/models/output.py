from google.appengine.ext import ndb
from core.models import BaseModel


class Output(BaseModel):
    title = ndb.StringProperty()
    component = ndb.IntegerProperty()

    @classmethod
    def get_all(cls):
        return Output.query().fetch()

    @classmethod
    def create(cls, entity):
        if entity.title and entity.component:
            output = Output(
                title=entity.title,
                component=entity.component,
                definition=entity.definition)
            output.put()
            return output
        else:
            return False

    @classmethod
    def update(cls, output, entity):
        if output:
            output.title = entity.title
            output.put()
            return output
        else:
            return False
