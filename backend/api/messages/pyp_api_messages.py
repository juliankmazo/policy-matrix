from protorpc import messages

class PypResponse(messages.Message):
    id = messages.IntegerField(1)
    country = messages.StringField(2)
    title = messages.StringField(3)
    description = messages.StringField(4)
    contactPerson = messages.StringField(5)
    typology = messages.StringField(6)
    regulatoryFramework = messages.StringField(7)
    regulatoryFrameworkReference = messages.StringField(8)
    parents = messages.StringField(9)
    childrens = messages.StringField(10)
    beneficiaries = messages.StringField(11)
    geographicalCoverage = messages.StringField(12)
    geographicalPlace = messages.StringField(13)
    dateEntry = messages.StringField(14)
    timeFrame = messages.StringField(15)
    source = messages.StringField(16)
    totalBudget = messages.StringField(17)
    currency = messages.StringField(18)
    comments = messages.StringField(19)


class PypListResponse(messages.Message):
    pyps = messages.MessageField(PypResponse, 1, repeated=True)


class PypRequest(messages.Message):
    country = messages.StringField(1)
    title = messages.StringField(2)
    description = messages.StringField(3)
    contactPerson = messages.StringField(4)
    typology = messages.StringField(5)
    regulatoryFramework = messages.StringField(6)
    regulatoryFrameworkReference = messages.StringField(7)
    parents = messages.StringField(8)
    childrens = messages.StringField(9)
    beneficiaries = messages.StringField(10)
    geographicalCoverage = messages.StringField(11)
    geographicalPlace = messages.StringField(12)
    dateEntry = messages.StringField(13)
    timeFrame = messages.StringField(14)
    source = messages.StringField(15)
    totalBudget = messages.StringField(16)
    currency = messages.StringField(17)
    comments = messages.StringField(18)
