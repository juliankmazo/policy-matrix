# -*- coding: utf-8 -*-
from core.helpers import BaseHelper
from core.models import Cliente
from core.models import Consecutivo
from admin_helper import RutaHelper
from google.appengine.ext import ndb


class ClientHelper(BaseHelper):

    @classmethod
    def query_all(cls):
        return Cliente.query().order(Cliente.nombres).fetch()

    @classmethod
    def query_by_ruta(cls, urlkey_ruta):
        ruta_key = ndb.Key(urlsafe=urlkey_ruta)
        return Cliente.query(Cliente.ruta == ruta_key).order(Cliente.nombres).fetch()

    @classmethod
    def nuevo_registro(cls, documento, ruta, nombres, apellidos, dir_casa,
                       tel_casa, celular, nombre_est, dir_est):
        existe_ruta = RutaHelper.existe(ruta)
        existe_documento = cls.existe_documento(documento)
        if existe_ruta and not existe_documento and documento and nombres and apellidos:
            con = Consecutivo.get_cliente()
            nuevo_cliente = Cliente(documento=documento, ruta=existe_ruta.key,
                                    nombres=nombres, apellidos=apellidos,
                                    dir_casa=dir_casa, tel_casa=tel_casa,
                                    celular=celular, nombre_est=nombre_est,
                                    dir_est=dir_est, consecutivo=con)
            nuevo_cliente.put()
            return ["alert-success", "El registro ha sido exitoso"]
        else:
            return ["alert-danger", "No se pudo completar el registro"]

    @classmethod
    def actualizar_registro(cls, cliente_key, documento, ruta, nombres, apellidos, dir_casa,
                            tel_casa, celular, nombre_est, dir_est):
        existe_ruta = RutaHelper.existe(ruta)
        cliente = cliente_key.get()
        if cliente:
            cliente.documento = documento
            cliente.ruta = existe_ruta.key
            cliente.nombres = nombres
            cliente.apellidos = apellidos
            cliente.dir_casa = dir_casa
            cliente.tel_casa = tel_casa
            cliente.celular = celular
            cliente.nombre_est = nombre_est
            cliente.dir_est = dir_est
            cliente.put()
            return ["alert-success", "La actualización ha sido exitoso"]
        else:
            return ["alert-danger", "No se pudo completar la actualización"]

    @classmethod
    def existe_documento(cls, documento):
        if documento:
            if Cliente.query(Cliente.documento == documento).fetch():
                return True
            else:
                return False
        else:
            return False
