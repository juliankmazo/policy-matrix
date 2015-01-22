# -*- coding: utf-8 -*-
from core.helpers import BaseHelper
from core.helpers import CreditHelper
from core.helpers import RutaHelper
from core.helpers import AbonoHelper
from core.helpers import TransaccionHelper
from core.models import Credito
from core.models import Abono
from core.models import Consecutivo
from core.models import Transaccion
from core.models import StatsDiarias
from google.appengine.ext import ndb
import datetime
import logging


class ReportesHelper(BaseHelper):

    @classmethod
    def cuadre_ruta_fecha(cls, fecha_string, urlkey_ruta, params):

        fecha = cls.strp2datetime(fecha_string)
        fecha_up, fecha_down = cls.limites_fecha(fecha)
        params, abonos = cls.stats_abonos(fecha_up, fecha_down, urlkey_ruta,
                                          params)
        params, creditos = cls.stats_creditos(fecha_up, fecha_down,
                                              urlkey_ruta, params)
        params, transacciones = cls.stats_transacciones(fecha_up, fecha_down,
                                                        urlkey_ruta, params)
        params = cls.saldo_rutas(urlkey_ruta, params)
        params['rutas'] = RutaHelper.query_all()
        params['caja_anterior'] = params['saldo_total'] -\
            params['total_abonos'] +\
            params['total_creditos'] -\
            params['total_entradas'] +\
            params['total_salidas']

        return abonos, creditos, transacciones, params

    @classmethod
    def crear_stats_diarias(cls):
        fecha = cls.fecha_actual_mexico()
        rutas = RutaHelper.query_activos()
        stats = StatsDiarias(fecha=fecha)
        stats.put()

    @classmethod
    def stats_abonos(cls, fecha_up, fecha_down, urlkey_ruta, params):
        abonos = AbonoHelper.query_by_date(fecha_up, fecha_down, urlkey_ruta)
        if abonos:
            for a in abonos:
                params['total_abonos'] += a.valor
            params['clientes_abonaron'] = len(abonos)

        return params, abonos

    @classmethod
    def stats_creditos(cls, fecha_up, fecha_down, urlkey_ruta, params):
        creditos = CreditHelper.query_by_date(fecha_up, fecha_down,
                                               urlkey_ruta)
        params['total_creditos'] = 0
        params['total_cuota'] = 0
        if creditos:
            for c in creditos:
                params['total_creditos'] += c.valor
        if urlkey_ruta:
            creditos_activos = CreditHelper.query_by_ruta(urlkey_ruta)
        else:
            creditos_activos = CreditHelper.query_activos()

        if creditos_activos:
            for c in creditos_activos:
                params['total_cuota'] += c.valor_cuota
            params['total_clientes'] = len(creditos_activos)
        if params['total_cuota'] == 0:
            params['total_cuota'] = 1
        return params, creditos

    @classmethod
    def stats_transacciones(cls, fecha_up, fecha_down, urlkey_ruta, params):
        transacciones = TransaccionHelper.query_by_date(fecha_up, fecha_down,
                                                        urlkey_ruta)
        if transacciones:
            for t in transacciones:
                if t.tipo in ["EC"]:
                    params['total_entradas'] += t.valor
                else:
                    params['total_salidas'] += t.valor
        return params, transacciones

    @classmethod
    def saldo_rutas(cls, urlkey_ruta, params):
        if urlkey_ruta:
            ruta = ndb.Key(urlsafe=urlkey_ruta).get()
        else:
            ruta = False

        if ruta:
            params['saldo_total'] = RutaHelper.get_saldo(ruta)
            return params
        else:
            rutas = RutaHelper.query_all()
            for r in rutas:
                params['saldo_total'] += RutaHelper.get_saldo(r)
            return params

    @classmethod
    def limites_fecha(cls, fecha, utc=-6):
        if not fecha:
            fecha = cls.hora_actual_mexico()
        fecha_up = datetime.datetime(fecha.year, fecha.month, fecha.day, 23, 59) + datetime.timedelta(hours=-utc)
        fecha_down = datetime.datetime(fecha.year, fecha.month, fecha.day) + datetime.timedelta(hours=-utc)
        return fecha_down, fecha_up

    @classmethod
    def strp2datetime(cls, fecha_string):
        return datetime.datetime.strptime(str(fecha_string), "%d/%m/%Y") if fecha_string else None

    @classmethod
    def query_abonos_9dias(cls, fecha_str, urlkey_ruta=None):
        fecha = cls.strp2datetime(fecha_str) if fecha_str else cls.hora_actual_mexico()
        lim_fechas = [ReportesHelper().limites_fecha(fecha + datetime.timedelta(days=i)) for i in xrange(0, 9)]
        abonos = []
        fechas = []
        if urlkey_ruta:
            for down, up in lim_fechas:
                abonos.append(Abono.query(ndb.AND(Abono.ruta == ndb.Key(urlsafe=urlkey_ruta), Abono.creado > down, Abono.creado < up)).fetch())
                fechas.append(down)
        else:
            for down, up in lim_fechas:
                abonos.append(Abono.query(ndb.AND(Abono.creado > down, Abono.creado < up)).fetch())
                fechas.append(down)
        return abonos, fechas

    @classmethod
    def query_creditos(cls, urlkey_ruta):
        return Credito.query(Credito.ruta == ndb.Key(urlsafe=urlkey_ruta)).fetch()

    @classmethod
    def fecha_actual_mexico(cls):
        fecha = datetime.datetime.now() + datetime.timedelta(hours=-6)
        fecha_mexico = datetime.date(fecha.year, fecha.month, fecha.day)
        return fecha_mexico

    @classmethod
    def hora_actual_mexico(cls):
        return datetime.datetime.now() + datetime.timedelta(hours=-6)
