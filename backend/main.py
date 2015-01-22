#!/usr/bin/env python
# -*- coding: utf-8 -*-
import webapp2
from core.controllers import MainController
from core.controllers import AdminController
from core.controllers import ClientController
from core.controllers import NewClientController
from core.controllers import CreditController
from core.controllers import NewCreditController
from core.controllers import DepositController
from core.controllers import ExpenseController
from core.controllers import LoginController
from core.controllers import LogoutController
from core.controllers import CiudadController
from core.controllers import CajaController
from core.controllers import RutaController
from core.controllers import UsuarioController
from core.controllers import EnableController
from core.controllers import DisableController
from core.controllers import DeleteController
from core.controllers import CuadreRutaController
from core.controllers import RecaudadorAbonosController
from core.controllers import RecaudadorManualController
from core.controllers import RecaudadorController


app = webapp2.WSGIApplication([
    ('/', MainController),
    ('/login', LoginController),
    ('/logout', LogoutController),
    ('/index', CuadreRutaController),
    ('/admin', AdminController),
    ('/admin/ciudad', CiudadController),
    ('/admin/caja', CajaController),
    ('/admin/ruta', RutaController),
    ('/admin/usuario', UsuarioController),
    ('/admin/activar', EnableController),
    ('/admin/desactivar', DisableController),
    ('/admin/borrar', DeleteController),
    ('/cliente', ClientController),
    ('/cliente/nuevo', NewClientController),
    ('/cliente/([^/]+)?', ClientController),
    ('/credito', CreditController),
    ('/credito/nuevo', NewCreditController),
    ('/abono', DepositController),
    ('/gasto', ExpenseController),
    ('/reportes/cuadre-ruta', CuadreRutaController),
    ('/reportes/recaudador-abonos', RecaudadorAbonosController),
    ('/reportes/recaudador-manual', RecaudadorManualController),
    ('/reportes/recaudador', RecaudadorController)
], debug=True)
