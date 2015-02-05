from protorpc import messages


class ObjectiveResponse(messages.Message):
    id = messages.IntegerField(1)
    title = messages.StringField(2)
    subObj = messages.IntegerField(3, repeated=True)
    pyp = messages.IntegerField(4)


class ObjectiveListResponse(messages.Message):
    objectives = messages.MessageField(ObjectiveResponse, 1, repeated=True)


class ObjectiveRequest(messages.Message):
    title = messages.StringField(1)
    subObj = messages.IntegerField(2, repeated=True)
    pyp = messages.IntegerField(3)
