#!/usr/bin/env python
# -*- coding: utf-8 -*-
import webapp2
from core.controllers import MainController
from core.controllers import LoginController
from core.controllers import LogoutController
from core.controllers import StudyController
from core.controllers import NewStudyController
from core.controllers import NewVariableController
from core.controllers import NewIssueController
from core.controllers import IndexController


app = webapp2.WSGIApplication([
    ('/', MainController),
    ('/login', LoginController),
    ('/logout', LogoutController),
    ('/index', IndexController),
    ('/study', StudyController),
    ('/study/new', NewStudyController),
    ('/variable/new', NewVariableController),
    ('/issue/new', NewIssueController),
], debug=True)
