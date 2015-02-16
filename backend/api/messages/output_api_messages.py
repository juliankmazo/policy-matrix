from protorpc import messages


class OutputResponse(messages.Message):
    id = messages.IntegerField(1)
    title = messages.StringField(2)
    objective = messages.IntegerField(3)
    description = messages.StringField(4)
    baseline = messages.StringField(5)
    target = messages.StringField(6)
    budget = messages.StringField(7)
    policyInstrument = messages.StringField(8)
    activity = messages.StringField(9)


class OutputListResponse(messages.Message):
    outputs = messages.MessageField(OutputResponse, 1, repeated=True)


class OutputRequest(messages.Message):
    title = messages.StringField(1)
    objective = messages.IntegerField(2)
    description = messages.StringField(3)
    baseline = messages.StringField(4)
    target = messages.StringField(5)
    budget = messages.StringField(6)
    policyInstrument = messages.StringField(7)
    activity = messages.StringField(8)
