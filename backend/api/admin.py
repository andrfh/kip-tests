from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Ticket, User, StudentProfile, StudyGroup, Subject

# Register your models here.

class StudentProfileInline(admin.StackedInline):
    model = StudentProfile
    can_delete = False

class ApiUserAdmin(UserAdmin):
    model = User

    inlines = [StudentProfileInline]
    readonly_fields = ('id',) + UserAdmin.readonly_fields 
    list_display = ('id', 'role') + UserAdmin.list_display

    fieldsets = (
        (None, {'fields': ('role', 'id')}),
    ) + UserAdmin.fieldsets

admin.site.register(Ticket)
admin.site.register(User, ApiUserAdmin)

admin.site.register(StudyGroup)
admin.site.register(Subject)
