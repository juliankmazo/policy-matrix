from protorpc import messages


class OutputResponse(messages.Message):
    id = messages.IntegerField(1)
    title = messages.StringField(2)
    coponent = messages.IntegerField(3)


class OutputListResponse(messages.Message):
    outputs = messages.MessageField(OutputResponse, 1, repeated=True)


class OutputRequest(messages.Message):
    title = messages.StringField(1)
    component = messages.IntegerField(2)
