from core.controllers import BaseController
from core.helpers import RutaHelper
from core.helpers import CreditHelper
from core.helpers import AbonoHelper
from core.helpers import TransaccionHelper
from google.appengine.ext import ndb
import time
import datetime


class DepositController(BaseController):
    def get(self):
        self.is_logged()
        urlkey_ruta = self.ruta_by_role()
        rutas = RutaHelper.query_all()
        if urlkey_ruta:
            creditos_activos = CreditHelper.query_by_ruta(urlkey_ruta)
            r_actual = ndb.Key(urlsafe=urlkey_ruta).get()
        else:
            creditos_activos = CreditHelper.query_activos()
            r_actual = False
        hoyutc = datetime.datetime.now() - datetime.timedelta(hours=6)
        hoy = datetime.date(hoyutc.year, hoyutc.month, hoyutc.day)
        self.render("deposit.html", creditos_activos=creditos_activos, hoy=hoy,
                    r_actual=r_actual, rutas=rutas)

    def post(self):
        self.is_logged()
        urlkey_credito = self.request.get("urlkey_credito")
        valor = int(self.request.get("valor")) if self.request.get("valor") else None
        alert = AbonoHelper.nuevo_registro(urlkey_credito, valor)
        time.sleep(1)
        self.redirect("/abono")



class ExpenseController(BaseController):
    def get(self):
        self.is_admin()
        rutas = RutaHelper.query_all()
        transacciones = TransaccionHelper.query_all()
        self.render("expense.html", rutas=rutas, transacciones=transacciones)

    def post(self):
        self.is_logged()
        self.is_admin()
        urlkey_ruta = self.request.get("urlkey_ruta")
        tipo = self.request.get("tipo_movimiento")
        valor = int(self.request.get("valor")) if self.request.get("valor") else None
        observacion = self.request.get("observacion")
        alert = TransaccionHelper.nuevo_registro(urlkey_ruta, valor, tipo,
                                                 observacion)
        time.sleep(1)
        self.redirect("/gasto")
