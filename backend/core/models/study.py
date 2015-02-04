from google.appengine.ext import ndb

from core.models import BaseModel


class Study(BaseModel):

    # Informacion Personal
    title = ndb.StringProperty(required=True)
    country = ndb.StringProperty()
