from core.controllers import BaseController
from google.appengine.ext import ndb
import datetime
import logging


class NewStudyController(BaseController):
    def get(self):
        self.render("new_study.html", cliente=None)


class NewVariableController(BaseController):
    def get(self):
        self.render("new_variable.html", cliente=None)


class NewIssueController(BaseController):
    def get(self):
        self.render("new_study.html", cliente=None)


class StudyController(BaseController):
    def get(self):
        self.render("study.html",
                    abonos=None,
                    creditos=None,
                    fechas=None,
                    r_actual=None
                    )
