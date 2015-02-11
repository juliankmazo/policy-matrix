from core.models import BaseModel
from core.models import Keyword

from google.appengine.ext import ndb


class Variable(BaseModel):
    name = ndb.StringProperty()
    tipo = ndb.StringProperty()
    keywords = ndb.KeyProperty(Keyword, repeated=True)
    description = ndb.StringProperty()

    @classmethod
    def get_all(cls):
        return Variable.query().fetch()

    @classmethod
    def create(cls, name, tipo, keywords, description):
        if name and tipo:
            variable = Variable(
                name=name,
                tipo=tipo,
                keywords=keywords,
                description=description
                )
            variable.put()
            return variable
        else:
            return False

    @classmethod
    def update(cls, variable, name, tipo, keywords, description):
        if variable:
            variable.name = name
            variable.tipo = tipo
            variable.keywords = [Keyword.update(keyword) for keyword in keywords]
            variable.description = description
            variable.put()
            return variable
        else:
            return False
