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

    go_name = ndb.StringProperty()
    go_target = ndb.StringProperty()
    go_baseline = ndb.StringProperty()

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
                go_name=entity.go_name,
                go_target=entity.go_target,
                go_baseline=entity.go_baseline
                )
            pyp.put()
            return pyp
        else:
            return False

    @classmethod
    def update(cls, pyp, entity):
        if pyp:
            pyp.country = entity.country
            pyp.title = entity.title
            pyp.description = entity.description
            pyp.contact_person = entity.contactPerson
            pyp.typology = entity.typology
            pyp.regulatory_framework = entity.regulatoryFramework
            pyp.regulatory_framework_reference = entity.regulatoryFrameworkReference
            pyp.parents = entity.parents
            pyp.childrens = entity.childrens
            pyp.beneficiaries = entity.beneficiaries
            pyp.geographical_coverage = entity.geographicalCoverage
            pyp.geographical_place = entity.geographicalPlace
            pyp.date_entry = entity.dateEntry
            pyp.time_frame = entity.timeFrame
            pyp.source = entity.source
            pyp.total_budget = entity.totalBudget
            pyp.currency = entity.currency
            pyp.comments = entity.comments
            pyp.objectives = entity.objectives
            pyp.go_name = entity.go_name,
            pyp.go_target = entity.go_target,
            pyp.go_baseline = entity.go_baseline
            pyp.put()
            return pyp
        else:
            return False

    @classmethod
    def add_objective(cls, request, objective):
        pyp = Pyp.get_by_id(request.pyp)
        if pyp:
            pyp.objectives.append(objective.key.id())
            pyp.put()
        return
