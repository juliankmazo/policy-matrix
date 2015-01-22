from core.controllers import BaseController
from core.helpers import ReportesHelper
from core.helpers import CreditHelper
from google.appengine.ext import ndb
import datetime
import logging


class CuadreRutaController(BaseController):
    def get(self):
        self.is_logged()
        fecha_str = self.request.get("fecha_str")
        urlkey_ruta = self.ruta_by_role()
        params = dict(
            total_abonos=0,
            total_creditos=0,
            total_entradas=0,
            total_salidas=0,
            total_cuota=0,
            clientes_abonaron=0,
            total_clientes=0,
            saldo_total=0)
        abonos, creditos, transacciones, params = ReportesHelper.cuadre_ruta_fecha(
            fecha_str, urlkey_ruta, params)
        if urlkey_ruta:
            ruta = ndb.Key(urlsafe=urlkey_ruta).get()
            if ruta:
                r_actual = ruta.nombre
        else:
            r_actual = False
        self.render("cuadre_ruta.html",
                    abonos=abonos,
                    creditos=creditos,
                    transacciones=transacciones,
                    r_actual=r_actual,
                    **params)


class RecaudadorAbonosController(BaseController):
    def get(self):
        fecha_str = self.request.get("fecha_str")
        urlkey_ruta = self.ruta_by_role()
        if urlkey_ruta:
            creditos = ReportesHelper().query_creditos(urlkey_ruta)
            abonos, fechas = ReportesHelper().query_abonos_9dias(fecha_str, urlkey_ruta)
            ruta = ndb.Key(urlsafe=urlkey_ruta).get()
            if ruta:
                r_actual = ruta.nombre
        else:
            creditos = CreditHelper().query_all()
            abonos, fechas = ReportesHelper().query_abonos_9dias(fecha_str)
            r_actual = False
        self.render("recaudador-abonos.html",
                    abonos=abonos,
                    creditos=creditos,
                    fechas=fechas,
                    r_actual=r_actual
                    )


class RecaudadorManualController(BaseController):
    def get(self):
        fecha_str = self.request.get("fecha_str")
        num_dias = int(self.request.get("num_dias")) if self.request.get("num_dias") else 5
        urlkey_ruta = self.ruta_by_role()
        fecha = ReportesHelper.strp2datetime(fecha_str) if fecha_str else ReportesHelper.hora_actual_mexico()
        fechas = [ReportesHelper.limites_fecha(fecha + datetime.timedelta(days=i))[0] for i in xrange(0, num_dias)]
        if urlkey_ruta:
            creditos = ReportesHelper().query_creditos(urlkey_ruta)
            ruta = ndb.Key(urlsafe=urlkey_ruta).get()
            if ruta:
                r_actual = ruta.nombre
        else:
            creditos = CreditHelper().query_all()
            r_actual = False
        self.render("recaudador-manual.html",
                    creditos=creditos,
                    fechas=fechas,
                    num_dias=num_dias,
                    r_actual=r_actual
                    )


class RecaudadorController(BaseController):
    def get(self):
        urlkey_ruta = self.ruta_by_role()
        if urlkey_ruta:
            creditos = ReportesHelper().query_creditos(urlkey_ruta)
            ruta = ndb.Key(urlsafe=urlkey_ruta).get()
            if ruta:
                r_actual = ruta.nombre
        else:
            creditos = CreditHelper().query_all()
            r_actual = False
        self.render("recaudador.html",
                    creditos=creditos,
                    r_actual=r_actual
                    )


class TablaCreditosAbonos(BaseController):
    def get(self):
        self.is_logged()
        fecha_str = self.request.get("fecha_str")
        urlkey_ruta = self.ruta_by_role()
