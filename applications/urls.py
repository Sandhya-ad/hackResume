from django.urls import path
from .views import get_applications

urlpatterns = [
    path('applications/', get_applications, name='get_applications'),
]