from protorpc import messages


class PypResponse(messages.Message):
    id = messages.IntegerField(1)
    country = messages.StringField(2)
    title = messages.StringField(3)
    description = messages.StringField(4)
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
    totalBudget = messages.StringField(15)
    currency = messages.StringField(16)
    objectives = messages.IntegerField(17, repeated=True)
    totalOutputs = messages.IntegerField(18)
    goName = messages.StringField(19)
    goBaseline = messages.StringField(20)
    goTarget = messages.StringField(21)
    responsible = messages.StringField(22)
    responsibleDuties = messages.StringField(23)
    institutionalArrangements = messages.StringField(24)
    contactName = messages.StringField(25)
    contactEmail = messages.StringField(26)
    contactJob = messages.StringField(27)
    contactNumber = messages.StringField(28)
    source = messages.StringField(29)
    comments = messages.StringField(30)


class PypListResponse(messages.Message):
    pyps = messages.MessageField(PypResponse, 1, repeated=True)


class PypRequest(messages.Message):
    country = messages.StringField(1)
    title = messages.StringField(2)
    description = messages.StringField(3)
    typology = messages.StringField(4)
    regulatoryFramework = messages.StringField(5)
    regulatoryFrameworkReference = messages.StringField(6)
    parents = messages.StringField(7)
    childrens = messages.StringField(8)
    beneficiaries = messages.StringField(9)
    geographicalCoverage = messages.StringField(10)
    geographicalPlace = messages.StringField(11)
    dateEntry = messages.StringField(12)
    timeFrame = messages.StringField(13)
    totalBudget = messages.StringField(14)
    currency = messages.StringField(15)
    objectives = messages.IntegerField(16, repeated=True)
    goName = messages.StringField(17)
    goBaseline = messages.StringField(18)
    goTarget = messages.StringField(19)
    responsible = messages.StringField(20)
    responsibleDuties = messages.StringField(21)
    institutionalArrangements = messages.StringField(22)
    contactName = messages.StringField(23)
    contactEmail = messages.StringField(24)
    contactJob = messages.StringField(25)
    contactNumber = messages.StringField(26)
    source = messages.StringField(27)
    comments = messages.StringField(28)
