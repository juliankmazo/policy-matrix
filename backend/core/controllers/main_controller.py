from core.controllers import BaseController


class MainController(BaseController):
    def get(self):
        self.is_logged()
        self.redirect("/index")
