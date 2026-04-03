from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()

router.register(r'tickets', views.TicketViewSet, basename='tickets')
router.register(r'attempts', views.TicketAttemptViewSet, basename='attempts')
router.register(r'study_groups', views.StudyGroupViewSet, basename='study_groups')
router.register(r'subjects', views.SubjectViewSet, basename='subjects')
router.register(r'students', views.StudentViewSet, basename='students')

urlpatterns = [
    path('', include(router.urls)),

    path('me/', views.me),
    path('fact/<int:n>/', views.fact),

    path('login/', views.login),
    # path('register/', views.register),
]
