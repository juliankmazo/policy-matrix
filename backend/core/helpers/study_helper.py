# -*- coding: utf-8 -*-
from core.helpers import BaseHelper
from core.models import Study
from google.appengine.ext import ndb


class StudyHelper(BaseHelper):

    @classmethod
    def query_all(cls):
        return Study.query().order(Study.country).fetch()

    @classmethod
    def create(cls, title, country):
        if title and country:
            study = Study(title=title, country=country).put()
            return study
        return False

    @classmethod
    def update(cls, key, title, country):
        study = ndb.Key(urlsafe=key).get()
        if title and country:
            study.title = title
            study.country = country
            study.put()
            return study
        return False
