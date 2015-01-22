from google.appengine.ext import ndb
from core.controllers import BaseController
from core.helpers import ClientHelper
from core.helpers import RutaHelper
import time
import logging


class ClientController(BaseController):
    def get(self):
        self.is_logged()
        urlkey_ruta = self.ruta_by_role()
        if urlkey_ruta:
            clientes = ClientHelper.query_by_ruta(urlkey_ruta)
            r_actual = ndb.Key(urlsafe=urlkey_ruta).get()
        else:
            clientes = ClientHelper.query_all()
            r_actual = False
        rutas = RutaHelper.query_all()
        logging.error(rutas)
        self.render("client.html", clientes=clientes, rutas=rutas, r_actual=r_actual)
        return


class NewClientController(BaseController):
    def get(self):
        self.is_logged()
        rutas = RutaHelper.query_all()
        self.render("new_client.html", rutas=rutas, cliente=None)

    def post(self):
        key = self.request.get("key")
        if key:
            cliente = ndb.Key(urlsafe=key).get()
            rutas = RutaHelper.query_all()
            self.render("new_client.html", rutas=rutas, cliente=cliente)
            return
        else:
            documento = int(self.request.get("documento")) if self.request.get("documento") else None
            nombres = self.request.get("nombres")
            apellidos = self.request.get("apellidos")
            dir_casa = self.request.get("dir_casa")
            tel_casa = int(self.request.get("tel_casa")) if self.request.get("tel_casa") else None
            celular = int(self.request.get("celular")) if self.request.get("celular") else None
            nombre_est = self.request.get("nombre_est")
            dir_est = self.request.get("dir_est")
            if self.user.role == "admin":
                ruta = self.request.get("urlkey_ruta")
            else:
                ruta = self.user.ruta.get().key.urlsafe()
            key = self.request.get("client_urlkey")
            if key:
                cliente = ndb.Key(urlsafe=key)
                alert = ClientHelper.actualizar_registro(cliente, documento, 
                                                         ruta, nombres,
                                                         apellidos, dir_casa,
                                                         tel_casa, celular,
                                                         nombre_est, dir_est)
            else:
                alert = ClientHelper.nuevo_registro(documento, 
                                                    ruta, nombres,
                                                    apellidos, dir_casa,
                                                    tel_casa, celular,
                                                    nombre_est, dir_est)
            time.sleep(1)
            self.redirect("/cliente")
