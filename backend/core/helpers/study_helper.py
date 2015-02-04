# -*- coding: utf-8 -*-
from core.helpers import BaseHelper
from core.models import Study
from google.appengine.ext import ndb


class StudyHelper(BaseHelper):

    @classmethod
    def query_all(cls):
        return Study.query().order(Study.country).fetch()

    @classmethod
    def create(cls, title):
        if title:
            study = Study(title=title).put()
            return study
        return False

    @classmethod
    def update(cls, key, title):
        study = ndb.Key(urlsafe=key).get()
        if title:
            study.title = title
            study.put()
            return study
        return False
