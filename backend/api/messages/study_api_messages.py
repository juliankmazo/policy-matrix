from protorpc import messages


class StudyResponse(messages.Message):
    id = messages.IntegerField(1)
    title = messages.StringField(2)
    variables = messages.IntegerField(3, repeated=True)


class StudyListResponse(messages.Message):
    studies = messages.MessageField(StudyResponse, 1, repeated=True)
    count = messages.IntegerField(2)


class StudyRequest(messages.Message):
    title = messages.StringField(1)
    variables = messages.IntegerField(2, repeated=True)
