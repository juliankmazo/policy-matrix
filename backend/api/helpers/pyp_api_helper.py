from api.helpers import BaseApiHelper
from api.messages import PypResponse

from core.models import Pyp


class PypApiHelper(BaseApiHelper):

    _model = Pyp

    def to_message(self, entity):
        return PypResponse(
            id=entity.key.id(),
            country=entity.country,
            title=entity.title,
            description=entity.description,
            contactPerson=entity.contact_person,
            typology=entity.typology,
            regulatoryFramework=entity.regulatory_framework,
            regulatoryFrameworkReference=entity.regulatory_framework_reference,
            parents=entity.parents,
            childrens=entity.childrens,
            beneficiaries=entity.beneficiaries,
            geographicalCoverage=entity.geographical_coverage,
            geographicalPlace=entity.geographical_place,
            dateEntry=entity.date_entry,
            timeFrame=entity.time_frame,
            source=entity.source,
            totalBudget=entity.total_budget,
            currency=entity.currency,
            comments=entity.comments
            )
