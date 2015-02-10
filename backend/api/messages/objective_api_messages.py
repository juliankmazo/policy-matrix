from protorpc import messages


class ObjectiveResponse(messages.Message):
    id = messages.IntegerField(1)
    title = messages.StringField(2)
    components = messages.IntegerField(3, repeated=True)
    pyp = messages.IntegerField(4)
    definition = messages.StringField(5)
    target = messages.StringField(6)


class ObjectiveListResponse(messages.Message):
    objectives = messages.MessageField(ObjectiveResponse, 1, repeated=True)


class ObjectiveRequest(messages.Message):
    title = messages.StringField(1)
    components = messages.IntegerField(2, repeated=True)
    pyp = messages.IntegerField(3)
    definition = messages.StringField(4)
    target = messages.StringField(5)
