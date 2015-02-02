from core.models import BaseModel
from google.appengine.ext import ndb


class Variable(BaseModel):
    title = ndb.StringProperty()
    tipo = ndb.StringProperty()
    keywords = ndb.StringProperty()
    description = ndb.StringProperty()
    definitions = ndb.StringProperty()

    @classmethod
    def get_all(cls):
        return Variable.query().fetch()

    @classmethod
    def create(cls, title, tipo, keywords, description, definitions):
        if title and tipo:
            variable = Variable(
                title=title,
                tipo=tipo,
                keywords=keywords,
                description=description,
                definitions=definitions
                )
            variable.put()
            return variable
        return False

    @classmethod
    def update(cls, variable, title, tipo, keywords, description, definitions):
        if title and tipo:
            variable.title = title
            variable.tipo = tipo
            variable.keywords = keywords
            variable.description = description
            variable.definitions = definitions
            variable.put()
            return variable
        else:
            return False
