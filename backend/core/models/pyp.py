from google.appengine.ext import ndb
from core.models import BaseModel


class Pyp(BaseModel):
    country = ndb.StringProperty()
    title = ndb.StringProperty()
    description = ndb.StringProperty()
    contact_person = ndb.StringProperty()
    typology = ndb.StringProperty()
    regulatory_framework = ndb.StringProperty()
    regulatory_framework_reference = ndb.StringProperty()
    parents = ndb.StringProperty()
    childrens = ndb.StringProperty()
    beneficiaries = ndb.StringProperty()
    geographical_coverage = ndb.StringProperty()
    geographical_place = ndb.StringProperty()
    date_entry = ndb.StringProperty()
    time_frame = ndb.StringProperty()
    source = ndb.StringProperty()
    total_budget = ndb.StringProperty()
    currency = ndb.StringProperty()
    comments = ndb.StringProperty()
    objectives = ndb.IntegerProperty(repeated=True)

    @classmethod
    def get_all(cls):
        return Pyp.query().fetch()

    @classmethod
    def create(cls, entity):
        if entity.title and entity.country:
            pyp = Pyp(
                country=entity.country,
                title=entity.title,
                description=entity.description,
                contact_person=entity.contactPerson,
                typology=entity.typology,
                regulatory_framework=entity.regulatoryFramework,
                regulatory_framework_reference=entity.regulatoryFrameworkReference,
                parents=entity.parents,
                childrens=entity.childrens,
                beneficiaries=entity.beneficiaries,
                geographical_coverage=entity.geographicalCoverage,
                geographical_place=entity.geographicalPlace,
                date_entry=entity.dateEntry,
                time_frame=entity.timeFrame,
                source=entity.source,
                total_budget=entity.totalBudget,
                currency=entity.currency,
                comments=entity.comments,
                )
            pyp.put()
            return pyp
        else:
            return False

    @classmethod
    def update(cls, pyp, entity):
        if pyp:
            if entity.country:
                pyp.country = entity.country
            if entity.title:
                pyp.title = entity.title
            if entity.description:
                pyp.description = entity.description
            if entity.contactPerson:
                pyp.contact_person = entity.contactPerson
            if entity.typology:
                pyp.typology = entity.typology
            if entity.regulatoryFramework:
                pyp.regulatory_framework = entity.regulatoryFramework
            if entity.regulatoryFrameworkReference:
                pyp.regulatory_framework_reference = entity.regulatoryFrameworkReference
            if entity.parents:
                pyp.parents = entity.parents
            if entity.childrens:
                pyp.childrens = entity.childrens
            if entity.beneficiaries:
                pyp.beneficiaries = entity.beneficiaries
            if entity.geographicalCoverage:
                pyp.geographical_coverage = entity.geographicalCoverage
            if entity.geographicalPlace:
                pyp.geographical_place = entity.geographicalPlace
            if entity.dateEntry:
                pyp.date_entry = entity.dateEntry
            if entity.timeFrame:
                pyp.time_frame = entity.timeFrame
            if entity.source:
                pyp.source = entity.source
            if entity.totalBudget:
                pyp.total_budget = entity.totalBudget
            if entity.currency:
                pyp.currency = entity.currency
            if entity.comments:
                pyp.comments = entity.comments
            if entity.objectives:
                pyp.objectives = entity.objectives
            pyp.put()
            return pyp
        else:
            return False

    @classmethod
    def add_objective(cls, request):
        pyp = Pyp.get_by_id(request.pyp)
        if pyp:
            pyp.objectives.append(request.id)
            pyp.put()
        return
