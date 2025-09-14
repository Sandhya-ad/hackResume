# urls.py - Function-based views (no DRF required)
from django.urls import path
from .views import (
    applications_view, application_detail_view,
    application_notes_view, application_note_detail_view,
    csrf_view, login_view, logout_view, me_view
)

urlpatterns = [
    # Auth endpoints
    path("auth/csrf/", csrf_view),
    path("auth/login/", login_view),
    path("auth/logout/", logout_view),
    path("auth/me/", me_view),
    
    # Application endpoints
    path("applications", applications_view),
    path("applications/", applications_view),
    path("applications/<int:pk>/", application_detail_view),
    
    # Note endpoints
    path("applications/<int:pk>/notes/", application_notes_view),
    path("applications/<int:pk>/notes/<int:note_id>/", application_note_detail_view),
]