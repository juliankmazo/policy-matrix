from google.appengine.ext import ndb
from core.models import BaseModel


class Component(BaseModel):
    title = ndb.StringProperty()
    objective = ndb.IntegerProperty()
    definition = ndb.StringProperty()
    outputs = ndb.IntegerProperty(repeated=True)

    @classmethod
    def get_all(cls):
        return Component.query().fetch()

    @classmethod
    def create(cls, entity):
        if entity.title and entity.objective:
            component = Component(
                title=entity.title,
                objective=entity.objective,
                definition=entity.definition)
            component.put()
            return component
        else:
            return False

    @classmethod
    def update(cls, component, entity):
        if component:
            component.title = entity.title
            component.definition = entity.definition
            component.put()
            return component
        else:
            return False

    @classmethod
    def add_output(cls, request, output):
        component = Component.get_by_id(request.pyp)
        if component:
            component.outputs.append(output.key.id())
            component.put()
        return
