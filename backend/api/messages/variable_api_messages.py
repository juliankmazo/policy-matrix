from protorpc import messages


class VariableResponse(messages.Message):
    id = messages.IntegerField(1)
    title = messages.StringField(2)
    tipo = messages.StringField(3)
    keywords = messages.StringField(4)
    description = messages.StringField(5)
    definitions = messages.StringField(6)


class VariableListResponse(messages.Message):
    variable = messages.MessageField(VariableResponse, 1, repeated=True)


class VariableRequest(messages.Message):
    title = messages.StringField(1)
    tipo = messages.StringField(2)
    keywords = messages.StringField(3)
    description = messages.StringField(4)
    definitions = messages.StringField(5)
