from google.appengine.ext import ndb

from core.models import BaseModel


class Credito(BaseModel):

    cliente = ndb.KeyProperty(required=True)
    ruta = ndb.KeyProperty(required=True)
    valor = ndb.IntegerProperty(required=True)
    tasa = ndb.IntegerProperty()
    fecha_cre = ndb.DateProperty()
    dias = ndb.IntegerProperty()
    fecha_ven = ndb.DateProperty()
    consecutivo = ndb.IntegerProperty()

    credito = ndb.IntegerProperty()
    saldo = ndb.IntegerProperty()
    valor_cuota = ndb.IntegerProperty()
    cuotas_faltantes = ndb.FloatProperty()

    # Informacion Pagos/Abonos
    abonos = ndb.KeyProperty(repeated=True)
    num_cuota = ndb.IntegerProperty()

    estado = ndb.StringProperty()
    fecha_ult_pago = ndb.DateProperty()
    num_atrasos = ndb.IntegerProperty()
    valor_atrasos = ndb.IntegerProperty()
    ajustes = ndb.IntegerProperty()
    visitas = ndb.IntegerProperty()

    activo = ndb.BooleanProperty()
