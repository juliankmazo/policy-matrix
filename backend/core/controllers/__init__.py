"""
These controllers are called when it initialises for accessing them more easily.
"""

from base_controller import BaseController

from index_controller import IndexController
from main_controller import MainController

from client_controller import ClientController
from client_controller import NewClientController

from credit_controller import CreditController
from credit_controller import NewCreditController

from cashbox_controller import DepositController
from cashbox_controller import ExpenseController

from login_controller import LoginController
from login_controller import LogoutController

from admin_controller import AdminController
from admin_controller import CiudadController
from admin_controller import CajaController
from admin_controller import RutaController
from admin_controller import UsuarioController
from admin_controller import EnableController
from admin_controller import DisableController
from admin_controller import DeleteController

from reportes_controller import CuadreRutaController
from reportes_controller import RecaudadorAbonosController
from reportes_controller import RecaudadorManualController
from reportes_controller import RecaudadorController
