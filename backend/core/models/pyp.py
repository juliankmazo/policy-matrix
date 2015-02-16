from google.appengine.ext import ndb
from core.models import BaseModel


class Pyp(BaseModel):
    country = ndb.StringProperty()
    title = ndb.StringProperty()
    description = ndb.StringProperty()
    acronym = ndb.StringProperty()
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
    total_budget = ndb.StringProperty()
    currency = ndb.StringProperty()
    objectives = ndb.IntegerProperty(repeated=True)

    go_name = ndb.StringProperty()
    go_target = ndb.StringProperty()
    go_baseline = ndb.StringProperty()

    responsible = ndb.StringProperty()
    responsible_duties = ndb.StringProperty()
    institutional_arrangements = ndb.StringProperty()

    contact_name = ndb.StringProperty()
    contact_email = ndb.StringProperty()
    contact_job = ndb.StringProperty()
    contact_number = ndb.StringProperty()

    source = ndb.StringProperty()
    comments = ndb.StringProperty()

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
                acronym=entity.acronym,
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
                total_budget=entity.totalBudget,
                currency=entity.currency,
                go_name=entity.goName,
                go_target=entity.goTarget,
                go_baseline=entity.goBaseline,
                responsible=entity.responsible,
                responsible_duties=entity.responsibleDuties,
                institutional_arrangements=entity.institutionalArrangements,
                contact_name=entity.contactName,
                contact_email=entity.contactEmail,
                contact_job=entity.contactJob,
                contact_number=entity.contactNumber,
                source=entity.source,
                comments=entity.comments,
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
            pyp.acronym = entity.acronym
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
            pyp.total_budget = entity.totalBudget
            pyp.currency = entity.currency
            pyp.objectives = entity.objectives
            pyp.go_name = entity.goName
            pyp.go_target = entity.goTarget
            pyp.go_baseline = entity.goBaseline
            pyp.responsible = entity.responsible
            pyp.responsible_duties = entity.responsibleDuties
            pyp.institutional_arrangements = entity.institutionalArrangements
            pyp.contact_name = entity.contactName
            pyp.contact_email = entity.contactEmail
            pyp.contact_job = entity.contactJob
            pyp.contact_number = entity.contactNumber
            pyp.source = entity.source
            pyp.comments = entity.comments
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
