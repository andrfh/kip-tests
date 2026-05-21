from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from api.models import StudentProfile, Ticket, User
from api.models.TicketAttempt import TicketAttempt
from api.permissions import TicketPermission
from api.serializers import ReadTicketSerializer, WriteTicketSerializer, NoQuestionsTicketSerializer

from api.audit import log_action
from api.models.AuditLog import AuditLog

def _attempts_left(ticket: Ticket, student: User) -> int:
    used = TicketAttempt.objects.filter(ticket=ticket, student=student).count()
    return max(0, ticket.max_attempts - used)


class TicketViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, TicketPermission]
    queryset = Ticket.objects.select_related('subject', 'study_group', 'author').all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            if self.action == 'retrieve' and self.request.user.role == User.Role.TEACHER:
                return ReadTicketSerializer
            return NoQuestionsTicketSerializer
        return WriteTicketSerializer

    def get_queryset(self):
        """
        Фильтрует queryset по роли пользователя.
        Пользователь видит ТОЛЬКО свои объекты — это ownership check на уровне списка.
        Попытка получить чужой объект по ID вернёт 404, а не 403.
        """
        user = self.request.user
        qs = Ticket.objects.select_related('subject', 'study_group', 'author')

        if user.role == User.Role.ADMIN:
            return qs.all()

        if user.role == User.Role.TEACHER:
            return qs.filter(author=user)

        if user.role == User.Role.STUDENT:
            try:
                profile = StudentProfile.objects.select_related('study_group').get(student=user)
                return qs.filter(study_group=profile.study_group)
            except StudentProfile.DoesNotExist:
                return qs.none()

        return qs.none()

    def list(self, request: Request):
        self.check_permissions(request)
        queryset = self.get_queryset()
        serializer = self.get_serializer_class()(queryset, many=True)
        data = list(serializer.data)

        if request.user.role == User.Role.STUDENT:
            for i, ticket_obj in enumerate(queryset):
                data[i]['attempts_left'] = _attempts_left(ticket_obj, request.user)

        return Response(data, status.HTTP_200_OK)

    def retrieve(self, request: Request, pk=None):
        self.check_permissions(request)
        ticket = get_object_or_404(self.get_queryset(), pk=pk)
        serializer = self.get_serializer_class()(instance=ticket)
        data = dict(serializer.data)

        if request.user.role == User.Role.STUDENT:
            data['attempts_left'] = _attempts_left(ticket, request.user)

        return Response(data, status.HTTP_200_OK)

    def create(self, request: Request):
        self.check_permissions(request)
        ticket_data = request.data.copy()
        ticket_data['author'] = request.user.id

        serializer = WriteTicketSerializer(data=ticket_data)
        if serializer.is_valid():
            serializer.save()
            ticket = serializer.save()
            # логирование создания билета
            log_action(request, AuditLog.Action.TICKET_CREATED, details={
                'ticket_id': ticket.pk,
                'ticket_name': ticket.name,
            })
            return Response(serializer.data, status.HTTP_201_CREATED)

        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)