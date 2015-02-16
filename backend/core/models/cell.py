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
        if entity.study and entity.variable and entity.output:
            cell = Cell(
                score=entity.score,
                scoreIndex=entity.scoreIndex,
                study=entity.study,
                variable=entity.variable,
                output=entity.output
                )
            cell.put()
            return cell
        else:
            return False

    @classmethod
    def update(cls, cell, entity):
        if cell:
            cell.score = entity.score,
            cell.scoreIndex = entity.scoreIndex,
            cell.study = entity.study,
            cell.variable = entity.variable,
            cell.output = entity.output
            cell.put()
            return cell.key
        return False
