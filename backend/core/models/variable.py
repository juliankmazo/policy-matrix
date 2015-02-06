from core.models import BaseModel
from google.appengine.ext import ndb


class Variable(BaseModel):
    name = ndb.StringProperty()
    tipo = ndb.StringProperty()
    keywords = ndb.StringProperty()
    description = ndb.StringProperty()
    definitions = ndb.StringProperty()

    @classmethod
    def get_all(cls):
        return Variable.query().fetch()

    @classmethod
    def create(cls, name, tipo, keywords, description, definitions):
        if name and tipo:
            variable = Variable(
                name=name,
                tipo=tipo,
                keywords=keywords,
                description=description,
                definitions=definitions
                )
            variable.put()
            return variable
        else:
            return False

    @classmethod
    def update(cls, variable, name, tipo, keywords, description, definitions):
        if variable:
            variable.name = name
            variable.tipo = tipo
            variable.keywords = keywords
            variable.description = description
            variable.definitions = definitions
            variable.put()
            return variable
        else:
            return False
