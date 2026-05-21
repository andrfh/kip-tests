from django.urls import path, include
from rest_framework import routers
from . import views
from .views.logout import logout
from .views.csrf import get_csrf_token
from .views.token_refresh import token_refresh

from .views.two_factor import verify_otp, setup_2fa, confirm_2fa, disable_2fa


router = routers.DefaultRouter()
router.register(r'tickets', views.TicketViewSet, basename='tickets')
router.register(r'attempts', views.TicketAttemptViewSet, basename='attempts')
router.register(r'study_groups', views.StudyGroupViewSet, basename='study_groups')
router.register(r'subjects', views.SubjectViewSet, basename='subjects')
router.register(r'students', views.StudentViewSet, basename='students')

urlpatterns = [
    path('', include(router.urls)),
    path('me/', views.me),
    path('login/', views.login),
    path('logout/', logout),
    path('token/refresh/', token_refresh),
    path('csrf/', get_csrf_token),
    path('2fa/verify/', verify_otp),
    path('2fa/setup/', setup_2fa),
    path('2fa/confirm/', confirm_2fa),
    path('2fa/disable/', disable_2fa),
]