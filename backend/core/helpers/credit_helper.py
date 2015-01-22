# -*- coding: utf-8 -*-
from core.helpers import BaseHelper
from core.helpers import RutaHelper
from core.models import Credito
from core.models import Consecutivo
from google.appengine.ext import ndb
import datetime


class CreditHelper(BaseHelper):

    @classmethod
    def nuevo_registro(cls, urlkey_cliente, valor, tasa, fecha_cre_str, dias,
                       fecha_ven_str):
        cliente = ndb.Key(urlsafe=urlkey_cliente)
        ruta = cliente.get().ruta
        credito = valor*tasa/100+valor
        saldo = credito
        valor_cuota = credito/dias
        con = Consecutivo.get_credito()
        fecha_cre = datetime.datetime.strptime(str(fecha_cre_str), "%d/%m/%Y")
        fecha_ven = datetime.datetime.strptime(str(fecha_ven_str), "%d/%m/%Y")
        if cliente and credito and fecha_cre and valor_cuota:
            nuevo_credito = Credito(cliente=cliente, ruta=ruta, valor=valor,
                                    tasa=tasa, fecha_cre=fecha_cre, dias=dias,
                                    fecha_ven=fecha_ven, consecutivo=con,
                                    credito=credito, saldo=saldo,
                                    valor_cuota=valor_cuota, num_cuota=0,
                                    cuotas_faltantes=dias, estado="A")
            nuevo_credito.put()
            RutaHelper.generar_salida(ruta.get(), valor)
            return ["alert-success", "El registro ha sido exitoso"]
        else:
            return ["alert-danger", "No se pudo completar el registro"]

    @classmethod
    def query_all(cls, admin=False):
        if admin:
            creditos = Credito.query().fetch()
        else:
            creditos = Credito.query(Credito.activo == True).fetch()
        return creditos

    @classmethod
    def query_by_ruta(cls, urlkey_ruta):
        ruta_key = ndb.Key(urlsafe=urlkey_ruta)
        return Credito.query(ndb.AND(
            Credito.ruta == ruta_key,
            Credito.estado == "A")).order(Credito.creado).fetch()

    @classmethod
    def query_activos(cls):
        return Credito.query(Credito.estado == "A").fetch()

    @classmethod
    def realizar_abono(cls, credito_a_abonar, valor, abono_key):
        credito_a_abonar.saldo -= valor
        credito_a_abonar.cuotas_faltantes -= valor/float(credito_a_abonar.valor_cuota)
        credito_a_abonar.fecha_ult_pago = datetime.datetime.now()
        credito_a_abonar.abonos.append(abono_key)
        credito_a_abonar.num_cuota += 1
        credito_a_abonar.put()
        return

    @classmethod
    def query_by_date(cls, fecha_up, fecha_down, urlkey_ruta):
        if urlkey_ruta:
            ruta = ndb.Key(urlsafe=urlkey_ruta)
        else:
            ruta = False

        if ruta and fecha_up and fecha_down:
            creditos = Credito.query(ndb.AND(
                Credito.creado >= fecha_down,
                Credito.creado <= fecha_up,
                Credito.estado == "A",
                Credito.ruta == ruta)).order(Credito.creado).fetch()
            return creditos
        elif fecha_up and fecha_down:
            creditos = Credito.query(ndb.AND(
                Credito.creado >= fecha_down,
                Credito.creado <= fecha_up,
                Credito.estado == "A")).order(Credito.creado).fetch()
            return creditos
