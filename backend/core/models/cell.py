from google.appengine.ext import ndb
from core.models import BaseModel


class Cell(BaseModel):
    score = ndb.IntegerProperty()
    scoreIndex = ndb.IntegerProperty()

    study = ndb.IntegerProperty(required=True)
    variable = ndb.IntegerProperty(required=True)
    output = ndb.IntegerProperty(required=True)

    @classmethod
    def get_all(cls):
        return Cell.query().fetch()

    @classmethod
    def create(cls, entity):
        if entity.study:
            cell = Cell(
                name=entity.name,
                definition=entity.definition)
            cell.put()
            return cell
        else:
            return False

    @classmethod
    def update(cls, entity):
        if entity.id:
            cell = Cell.get_by_id(entity.id)
        else:
            cell = Cell.create(entity)
        if cell:
            cell.name = entity.name
            cell.definition = entity.definition
            cell.put()
            return cell.key
        else:
            return False
