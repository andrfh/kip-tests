from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.fields import json
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import Request, Response

from api.models import StudentProfile, Ticket, User
from api.models.TicketAttempt import TicketAttempt
from api.permissions import TicketPermission
from api.serializers import ReadTicketSerializer, WriteTicketSerializer
from api.serializers import NoQuestionsTicketSerializer

def calculate_attempts_left_field(ticket: Ticket, student: User) -> int:
    return ticket.max_attempts - TicketAttempt.objects.filter(ticket=ticket, student=student).count()

class TicketViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, TicketPermission]
    queryset = Ticket.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            # Do not include questions if:
            # 1. This is not a detail request (getting a list of tickets)
            # 2. This is a detail request, but was made by a student
            if self.action == 'retrieve' and self.request.user.role == User.Role.TEACHER:
                return ReadTicketSerializer
            else:
                return NoQuestionsTicketSerializer
        else:
            return WriteTicketSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        if self.request.user.role == User.Role.TEACHER:
            queryset = Ticket.objects.filter(author=self.request.user)
        elif self.request.user.role == User.Role.STUDENT:
            queryset = Ticket.objects.filter(study_group=StudentProfile.objects.get(student=self.request.user).study_group)

        return queryset

    def list(self, request: Request):
        self.check_permissions(request)

        queryset = self.get_queryset()

        serializer = self.get_serializer_class()(queryset, many=True)
        data = serializer.data.copy()

        if self.request.user.role == User.Role.STUDENT:
            for i in range(len(data)):
                data[i]['attempts_left'] = calculate_attempts_left_field(ticket=queryset[i], student=request.user)

        return Response(data, status.HTTP_200_OK)

    def retrieve(self, request: Request, pk=None) -> Response:
        self.check_permissions(request)

        ticket = get_object_or_404(self.get_queryset(), pk=pk)
        seralizer = self.get_serializer_class()(instance=ticket)

        data = seralizer.data

        if self.request.user.role == User.Role.STUDENT:
            data['attempts_left'] = calculate_attempts_left_field(ticket=ticket, student=request.user)

        return Response(data, status.HTTP_200_OK)

    def create(self, request: Request):
        self.check_permissions(request)

        ticket_data = request.data.copy()

        ticket_data['author'] = request.user.id

        ticket_data['questions'] = json.dumps(ticket_data['questions'], ensure_ascii=False)

        serializer = self.get_serializer_class()(data=ticket_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_201_CREATED)

        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
