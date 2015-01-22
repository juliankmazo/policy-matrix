from core.controllers import BaseController
from core.helpers import RutaHelper
from core.helpers import ClientHelper
from core.helpers import CreditHelper
from google.appengine.ext import ndb
import time
import logging


class CreditController(BaseController):
    def get(self):
        self.is_logged()
        urlkey_ruta = self.ruta_by_role()
        rutas = RutaHelper.query_all()
        if urlkey_ruta:
            creditos = CreditHelper.query_by_ruta(urlkey_ruta)
            r_actual = ndb.Key(urlsafe=urlkey_ruta).get()
        else:
            creditos = CreditHelper.query_all()
            r_actual = False
        logging.error(creditos)
        self.render("credit.html", creditos=creditos, rutas=rutas,
                    r_actual=r_actual)

    def post(self):
        self.is_logged()
        key = self.request.get('key')
        credito = ndb.Key(urlsafe=key).get()
        abonos = [abono.get() for abono in credito.abonos]
        urlkey_ruta = self.ruta_by_role()
        rutas = RutaHelper.query_all()
        if urlkey_ruta:
            creditos = CreditHelper.query_by_ruta(urlkey_ruta)
            r_actual = ndb.Key(urlsafe=urlkey_ruta).get()
        else:
            creditos = CreditHelper.query_all()
            r_actual = False
        self.render("credit.html", creditos=creditos, rutas=rutas,
                    r_actual=r_actual, abonos=abonos, c_actual=credito)


class NewCreditController(BaseController):
    def get(self):
        self.is_logged()
        if self.user.role == "admin":
            clientes = ClientHelper.query_all()
        else:
            ruta_empleado = self.user.ruta.urlsafe()
            clientes = ClientHelper.query_by_ruta(ruta_empleado)
        self.render("new_credit.html", clientes=clientes)

    def post(self):
        self.is_logged()

        cliente = self.request.get("urlkey_cliente")
        valor = int(self.request.get("valor")) if self.request.get("valor") else None
        tasa = int(self.request.get("tasa")) if self.request.get("tasa") else None
        fecha_cre = self.request.get("fecha_cre")
        dias = int(self.request.get("dias")) if self.request.get("dias") else None
        fecha_ven = self.request.get("fecha_ven")

        alert = CreditHelper.nuevo_registro(cliente, valor, tasa,
                                             fecha_cre, dias, fecha_ven)
        time.sleep(1)
        self.redirect("/credito")
