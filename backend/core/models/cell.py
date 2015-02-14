from google.appengine.ext import ndb
from core.models import BaseModel


class Keyword(BaseModel):
    name = ndb.StringProperty()
    definition = ndb.TextProperty()

    @classmethod
    def get_all(cls):
        return Keyword.query().fetch()

    @classmethod
    def create(cls, entity):
        if entity.name:
            keyword = Keyword(
                name=entity.name,
                definition=entity.definition)
            keyword.put()
            return keyword
        else:
            return False

    @classmethod
    def update(cls, entity):
        if entity.id:
            keyword = Keyword.get_by_id(entity.id)
        else:
            keyword = Keyword.create(entity)
        if keyword:
            keyword.name = entity.name
            keyword.definition = entity.definition
            keyword.put()
            return keyword.key
        else:
            return False
