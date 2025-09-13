from django.urls import path
from .views_api import list_notes, create_note

urlpatterns = [
    path("api/applications/<int:app_id>/notes/", list_notes),       # GET
    path("api/applications/<int:app_id>/notes/new/", create_note),  # POST
]
