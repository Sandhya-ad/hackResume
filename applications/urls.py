from django.urls import path
from .views import applications_view

urlpatterns = [
    path('applications/', applications_view, name='applications_view'),
]