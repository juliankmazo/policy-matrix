from api.helpers import BaseApiHelper
from api.messages import PypResponse

from core.models import Pyp
from core.models import Objective


class PypApiHelper(BaseApiHelper):

    _model = Pyp

    def total_outputs(self, entity):
        sumOutputs = 0
        if entity.objectives:
            for objective_id in entity.objectives:
                sumOutputs += len(Objective.get_by_id(objective_id).outputs)
            return sumOutputs
        return 0

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
            comments=entity.comments,
            objectives=entity.objectives,
            totalOutputs=self.total_outputs(entity),
            goName=entity.go_name,
            goTarget=entity.go_target,
            goBaseline=entity.go_baseline
            )
