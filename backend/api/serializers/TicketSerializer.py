import ast

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
        if isinstance(data, list):
            return data

        if isinstance(data, str):
            parsed = data

            # Handle both plain JSON and double-encoded JSON strings.
            for _ in range(2):
                try:
                    parsed = json.loads(parsed)
                except (TypeError, ValueError):
                    break
                if not isinstance(parsed, str):
                    break

            # Fallback for Python-literal-style payloads from form submissions.
            if isinstance(parsed, str):
                try:
                    parsed = ast.literal_eval(parsed)
                except (ValueError, SyntaxError):
                    pass

            return parsed

        raise serializers.ValidationError('questions must be a JSON string or list')

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
        super().__init__(*args, **kwargs)
        self.fields.pop('questions', None)

class WriteTicketSerializer(BaseTicketSerializer):
    study_group = serializers.PrimaryKeyRelatedField(many=False, queryset=StudyGroup.objects)
    subject = serializers.PrimaryKeyRelatedField(many=False, queryset=Subject.objects)

    def validate_questions(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError('questions должен быть списком.')

        if len(value) == 0:
            raise serializers.ValidationError('Билет должен содержать хотя бы один вопрос.')

        if len(value) > 100:
            raise serializers.ValidationError('Билет не может содержать более 100 вопросов.')

        for i, question in enumerate(value):
            if not isinstance(question, dict):
                raise serializers.ValidationError(f'questions[{i}] должен быть объектом.')

            required_fields = ('id', 'text', 'correct_answer', 'points', 'answer_type')
            for field in required_fields:
                if field not in question:
                    raise serializers.ValidationError(
                        f'questions[{i}] отсутствует поле "{field}".'
                    )

            if not isinstance(question.get('text'), str) or len(question['text']) > 2000:
                raise serializers.ValidationError(
                    f'questions[{i}].text должен быть строкой не более 2000 символов.'
                )

            if not isinstance(question.get('points'), int) or question['points'] < 1 or question['points'] > 100:
                raise serializers.ValidationError(
                    f'questions[{i}].points должен быть целым числом от 1 до 100.'
                )

            if question.get('answer_type') != 'text':
                raise serializers.ValidationError(
                    f"questions[{i}].answer_type должен быть 'text'."
                )

            options = question.get('options', [])
            if not isinstance(options, list) or len(options) > 20:
                raise serializers.ValidationError(
                    f'questions[{i}].options должен быть списком не более 20 элементов.'
                )

        return value
