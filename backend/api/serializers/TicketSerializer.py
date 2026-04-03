from rest_framework import serializers
from rest_framework.fields import json

from api.models import Ticket, User, StudyGroup, Subject
from api.serializers.StudyGroupSerializer import StudyGroupSerializer
from api.serializers.SubjectSerializer import SubjectSerializer
from api.serializers.UserSerializer import ReadUserSerializer

class QuestionsJSONField(serializers.Field):
    def to_representation(self, value):
        return value

    def to_internal_value(self, data):
        return json.loads(data)

class BaseTicketSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(many=False, queryset=User.objects)
    questions = QuestionsJSONField()

    class Meta:
        model = Ticket
        # fields = ['id', 'name', 'created_at']
        fields = '__all__'

class ReadTicketSerializer(BaseTicketSerializer):
    study_group = StudyGroupSerializer(many=False, read_only=True)
    subject = SubjectSerializer(many=False, read_only=True)
    author = ReadUserSerializer()

class NoQuestionsTicketSerializer(ReadTicketSerializer):
    def __init__(self, *args, **kwargs):
        self.fields.pop('questions')
        super().__init__(*args, **kwargs)

class WriteTicketSerializer(BaseTicketSerializer):
    study_group = serializers.PrimaryKeyRelatedField(many=False, queryset=StudyGroup.objects)
    subject = serializers.PrimaryKeyRelatedField(many=False, queryset=Subject.objects)
