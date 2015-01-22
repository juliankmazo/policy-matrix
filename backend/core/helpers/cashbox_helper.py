# -*- coding: utf-8 -*-
from core.helpers import BaseHelper
from core.helpers import CreditHelper
from core.helpers import RutaHelper
from core.models import Credito
from core.models import Abono
from core.models import Consecutivo
from core.models import Transaccion
from google.appengine.ext import ndb
import datetime


class AbonoHelper(BaseHelper):

    @classmethod
    def nuevo_registro(cls, urlkey_credito, valor):
        credito_abono = ndb.Key(urlsafe=urlkey_credito).get()
        ruta_abono = credito_abono.ruta
        cliente_abono = credito_abono.cliente
        if credito_abono and ruta_abono and valor >= 0:
            con = Consecutivo.get_abono()
            a = Abono(ruta=ruta_abono, credito=credito_abono.key,
                      cliente=cliente_abono, valor=valor, consecutivo=con)
            a.put()
            CreditHelper.realizar_abono(credito_abono, valor, a.key)
            RutaHelper.generar_entrada(ruta_abono.get(), valor)
            return ["alert-success", "El registro ha sido exitoso"]
        else:
            return ["alert-danger", "No se pudo completar el registro"]

    @classmethod
    def query_by_date(cls, fecha_up, fecha_down, urlkey_ruta):
        if urlkey_ruta:
            ruta = ndb.Key(urlsafe=urlkey_ruta)
        else:
            ruta = False

        if ruta and fecha_up and fecha_down:
            abonos = Abono.query(ndb.AND(
                Abono.creado >= fecha_down,
                Abono.creado <= fecha_up,
                Abono.ruta == ruta)).order(Abono.creado).fetch()
            return abonos
        elif fecha_up and fecha_down:
            abonos = Abono.query(ndb.AND(
                 Abono.creado >= fecha_down,
                 Abono.creado <= fecha_up)).order(Abono.creado).fetch()
            return abonos


class TransaccionHelper(BaseHelper):

    @classmethod
    def nuevo_registro(cls, urlkey_ruta, valor, tipo, observacion):
        ruta = ndb.Key(urlsafe=urlkey_ruta).get()
        if ruta and valor and tipo:
            if tipo in ["EC"]:
                RutaHelper.generar_entrada(ruta, valor)
            else:
                RutaHelper.generar_salida(ruta, valor)
            t = Transaccion(ruta=ruta.key, valor=valor, tipo=tipo,
                            observacion=observacion)
            t.put()
            return ["alert-success", "El registro ha sido exitoso"]
        else:
            return ["alert-danger", "No se pudo completar el registro"]

    @classmethod
    def query_all(cls):
        return Transaccion.query().order(Transaccion.creado).fetch()

    @classmethod
    def query_by_date(cls, fecha_up, fecha_down, urlkey_ruta):
        if urlkey_ruta:
            ruta = ndb.Key(urlsafe=urlkey_ruta)
        else:
            ruta = False

        if ruta and fecha_up and fecha_down:
            transacciones = Transaccion.query(ndb.AND(
                Transaccion.creado >= fecha_down,
                Transaccion.creado <= fecha_up,
                Transaccion.ruta == ruta)).order(Transaccion.creado).fetch()
            return transacciones
        elif fecha_up and fecha_down:
            transacciones = Transaccion.query(ndb.AND(
                Transaccion.creado >= fecha_down,
                Transaccion.creado <= fecha_up)).order(Transaccion.creado).fetch()
            return transacciones
