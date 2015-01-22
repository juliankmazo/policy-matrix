from google.appengine.ext import ndb

from core.models import BaseModel


class Transaccion(BaseModel):

    ruta = ndb.KeyProperty(required=True)
    tipo = ndb.StringProperty(required=True)
    tipo_gasto = ndb.StringProperty()
    observacion = ndb.StringProperty(required=True)

    valor = ndb.IntegerProperty(required=True)
