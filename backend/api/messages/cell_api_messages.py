from protorpc import messages


class CellResponse(messages.Message):
    id = messages.IntegerField(1)
    score = messages.IntegerField(2)
    scoreIndex = messages.IntegerField(3)
    study = messages.IntegerField(4)
    variable = messages.IntegerField(5)
    output = messages.IntegerField(6)


class CellListResponse(messages.Message):
    cells = messages.MessageField(CellResponse, 1, repeated=True)


class CellRequest(messages.Message):
    score = messages.IntegerField(1)
    scoreIndex = messages.IntegerField(2)
    study = messages.IntegerField(3)
    variable = messages.IntegerField(4)
    output = messages.IntegerField(5)
