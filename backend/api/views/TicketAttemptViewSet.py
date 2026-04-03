from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from api.models.StudentProfile import StudentProfile
from api.models.Ticket import Ticket
from api.models.TicketAttempt import TicketAttempt
from api.models.User import User
from api.permissions import TicketAttemptPermissions
from api.serializers import ReadTicketAttemptSerializer, WriteTicketAttemptSerializer, ReadUnfinishedAttemptSerializer

def calculate_points(questions, answers) -> tuple[int, dict]:
    '''
    Calculate total points for this attempt
    Args:
        questions (dict): Ticket's questions
        answers (dict): Students's answers

    Returns:
        points (int): Total points
        answers (dict): Mutated answers with new key 'points' conataining value of
        points for this particular answer

    '''
    points = 0
    for answer in answers:
        id = answer['id']
        question = next(q for q in questions if q['id'] == id)
        if question:
            answer['points'] = 0
            # sort answer so the order of multiple choices won't matter
            if sorted(answer['answer']) == sorted(question['correct_answer']):
                answer['points'] = question['points']
                points += question['points']
    return points, answers

class TicketAttemptViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, TicketAttemptPermissions]

    queryset = TicketAttempt.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ReadTicketAttemptSerializer
        else:
            return WriteTicketAttemptSerializer

    @action(detail=True, methods=['post'])
    def submit(self, request: Request, pk=None):
        attempt = get_object_or_404(TicketAttempt, pk=pk, student=request.user)

        if attempt.finished_at != None:
            return Response('Попытка уже завершена',
                            status=status.HTTP_400_BAD_REQUEST)

        attempt.finished_at = timezone.now()
        time_spent_seconds = (attempt.finished_at - attempt.started_at).total_seconds()
        attempt.time_spent_seconds = int(time_spent_seconds)

        answers = request.data.copy()

        if time_spent_seconds > (attempt.ticket.time_limit_seconds + 5):
            attempt.points = 0
            attempt.answers = answers
            attempt.save()
            return Response('Превышен лимит по времени',
                            status=status.HTTP_406_NOT_ACCEPTABLE)

        questions = attempt.ticket.questions

        (attempt.points, attempt.answers) = calculate_points(questions, answers)
        attempt.save()

        serializer = ReadTicketAttemptSerializer(instance=attempt)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request: Request):
        self.check_permissions(request)

        data = request.data.copy()

        ticket = Ticket.objects.get(pk=data['ticket'])

        if ticket.study_group != StudentProfile.objects.get(student=request.user).study_group:
            return Response('Учебная группа билета и студента не совпадают.',
                            status.HTTP_403_FORBIDDEN)

        attempts_count = TicketAttempt.objects.filter(student=request.user, ticket=ticket).count()

        if attempts_count >= ticket.max_attempts:
            return Response('Превышен лимит попыток по этому билету',
                            status.HTTP_406_NOT_ACCEPTABLE)

        data['student'] = request.user.pk
        data['started_at'] = timezone.now()

        data['questions'] = ticket.questions.copy()

        for q in data['questions']:
            del q['correct_answer']

        serializer = self.get_serializer_class()(data=data)
        if serializer.is_valid():
            attempt = serializer.save()
            read_serializer = ReadUnfinishedAttemptSerializer(attempt)
            data = read_serializer.data.copy()
            return Response(data, status.HTTP_201_CREATED)

        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)

    def list(self, request: Request):
        self.check_permissions(request)
        # request.query_params.get('ticket')

        queryset = self.queryset

        if request.user.role == User.Role.TEACHER: # pyright: ignore[reportAttributeAccessIssue]
            queryset = queryset.filter(ticket__author=request.user)
        elif request.user.role == User.Role.STUDENT: # pyright: ignore[reportAttributeAccessIssue]
            queryset = queryset.filter(student=request.user)

        serializer = self.get_serializer_class()(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
