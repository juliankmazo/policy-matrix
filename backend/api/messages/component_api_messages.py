from protorpc import messages


class ComponentResponse(messages.Message):
    id = messages.IntegerField(1)
    title = messages.StringField(2)
    objective = messages.IntegerField(3)
    definition = messages.StringField(4)
    outputs = messages.IntegerField(5, repeated=True)


class ComponentListResponse(messages.Message):
    components = messages.MessageField(ComponentResponse, 1, repeated=True)


class ComponentRequest(messages.Message):
    title = messages.StringField(1)
    objective = messages.IntegerField(2)
    definition = messages.StringField(3)
    outputs = messages.IntegerField(4, repeated=True)
