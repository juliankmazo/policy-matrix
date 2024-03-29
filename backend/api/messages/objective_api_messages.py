from protorpc import messages


class ObjectiveResponse(messages.Message):
    id = messages.IntegerField(1)
    title = messages.StringField(2)
    outputs = messages.IntegerField(3, repeated=True)
    pyp = messages.IntegerField(4)
    description = messages.StringField(5)
    baseline = messages.StringField(6)
    target = messages.StringField(7)


class ObjectiveListResponse(messages.Message):
    objectives = messages.MessageField(ObjectiveResponse, 1, repeated=True)


class ObjectiveRequest(messages.Message):
    title = messages.StringField(1)
    outputs = messages.IntegerField(2, repeated=True)
    pyp = messages.IntegerField(3)
    description = messages.StringField(4)
    baseline = messages.StringField(5)
    target = messages.StringField(6)
