from google.appengine.ext import ndb
from core.models import BaseModel

class Subobjective(BaseModel):
    title = ndb.StringProperty()
