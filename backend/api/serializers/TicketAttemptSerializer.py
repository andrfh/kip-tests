from rest_framework import serializers

from api.models import Ticket, User
from api.models.TicketAttempt import TicketAttempt
from api.serializers.StudentSerializer import StudentSerializer
from api.serializers.TicketSerializer import NoQuestionsTicketSerializer, ReadTicketSerializer

class BaseTicketAttemptSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(many=False, queryset=User.objects)

    class Meta:
        model = TicketAttempt
        fields = '__all__'


class WriteTicketAttemptSerializer(BaseTicketAttemptSerializer):
    ticket = serializers.PrimaryKeyRelatedField(many=False, queryset=Ticket.objects)
    student = serializers.PrimaryKeyRelatedField(many=False, queryset=User.objects)

    class Meta:
        model = TicketAttempt
        fields = '__all__'

class ReadTicketAttemptSerializer(BaseTicketAttemptSerializer):
    ticket = NoQuestionsTicketSerializer()
    student = StudentSerializer()

class ReadUnfinishedAttemptSerializer(ReadTicketSerializer):
    class Meta:
        model = TicketAttempt
        fields = [ 'id', 'started_at', 'questions' ]
