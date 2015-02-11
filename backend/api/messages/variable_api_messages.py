from protorpc import messages


class KeywordMessage(messages.Message):
    id = messages.IntegerField(1)
    name = messages.StringField(2)
    definition = messages.StringField(3)


class VariableResponse(messages.Message):
    id = messages.IntegerField(1)
    name = messages.StringField(2)
    tipo = messages.StringField(3)
    keywords = messages.MessageField(KeywordMessage, 4, repeated=True)
    description = messages.StringField(5)


class VariableListResponse(messages.Message):
    variables = messages.MessageField(VariableResponse, 1, repeated=True)


class VariableRequest(messages.Message):
    name = messages.StringField(1)
    tipo = messages.StringField(2)
    keywords = messages.MessageField(KeywordMessage, 3, repeated=True)
    description = messages.StringField(4)
