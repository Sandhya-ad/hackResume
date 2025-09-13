from django.contrib import admin

# Register your models here.
from .models import Application, Note

admin.site.register(Application)
admin.site.register(Note)