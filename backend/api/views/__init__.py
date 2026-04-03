from rest_framework.response import Response

from rest_framework.decorators import api_view

from api.serializers import UserSerializer
from api.models import User

from .login import login
from .SubjectViewSet import SubjectViewSet
from .StudyGroupViewSet import StudyGroupViewSet
from .TicketViewSet import TicketViewSet
from .TicketAttemptViewSet import TicketAttemptViewSet
from .StudentViewSet import StudentViewSet
from .me import me

@api_view()
def fact(_, n: int):
    _f = lambda n: 1 if n == 1 else n * _f(n - 1)
    return Response({ 'result': _f(n) })
