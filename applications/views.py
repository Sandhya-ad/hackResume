# views.py - Updated function-based views (no DRF required)
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.dateparse import parse_date
from django.contrib.auth import authenticate, login, logout
from .models import JobApplication, ApplicationNote
import json

# ---------- helpers ----------
def _serialize(app: JobApplication):
    return {
        "id": app.id,
        "company": app.company_name,
        "role": app.position or "",
        "status": app.status,
        "date_applied": app.date_applied.isoformat() if app.date_applied else None,
        "next_followup_on": app.follow_up_date.isoformat() if app.follow_up_date else None,
        "notes": [_serialize_note(note) for note in app.application_notes.all()],
    }

def _serialize_note(note: ApplicationNote):
    return {
        "id": note.id,
        "content": note.content,
        "created_at": note.created_at.isoformat(),
        "updated_at": note.updated_at.isoformat(),
    }

def _require_auth(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Unauthorized"}, status=401)
    return None

# ---------- auth endpoints ----------
@ensure_csrf_cookie
@require_http_methods(["GET"])
def csrf_view(request):
    return JsonResponse({"ok": True})

@require_http_methods(["GET"])
def me_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"user": None})
    u = request.user
    return JsonResponse({"user": {"id": u.id, "username": u.username, "email": u.email}})

@require_http_methods(["POST"])
def login_view(request):
    data = json.loads(request.body or "{}")
    user = authenticate(request,
                        username=data.get("username") or "",
                        password=data.get("password") or "")
    if user is None:
        return JsonResponse({"error": "Invalid credentials"}, status=400)
    login(request, user)
    return JsonResponse({"ok": True})

@require_http_methods(["POST"])
def logout_view(request):
    logout(request)
    return JsonResponse({"ok": True})

# ---------- applications ----------
@require_http_methods(["GET", "POST"])
def applications_view(request):
    err = _require_auth(request)
    if err: return err

    if request.method == "GET":
        apps = JobApplication.objects.filter(user=request.user).order_by("-date_applied", "-id")

        if request.GET.get("flat") in {"1", "true", "yes"}:
            return JsonResponse([_serialize(a) for a in apps], safe=False)

        grouped = {}
        for app in apps:
            grouped.setdefault(app.status, []).append({
                "id": app.id,
                "company_name": app.company_name,
                "position": app.position,
                "date_applied": app.date_applied,
                "status": app.status,
                "notes": app.notes,
                "follow_up_date": app.follow_up_date,
            })
        return JsonResponse(grouped, safe=False)

    # POST create
    data = json.loads(request.body or "{}")
    app = JobApplication.objects.create(
        user=request.user,
        company_name=(data.get("company") or data.get("company_name") or "")[:255],
        position=(data.get("role") or data.get("position") or "")[:255],
        status=data.get("status", "applied"),
        notes=data.get("notes", ""),
        follow_up_date=parse_date(data.get("next_followup_on") or data.get("follow_up_date") or "") \
                       if (data.get("next_followup_on") or data.get("follow_up_date")) else None,
    )
    return JsonResponse(_serialize(app), status=201)

@require_http_methods(["GET", "PUT", "PATCH", "DELETE"])
def application_detail_view(request, pk: int):
    err = _require_auth(request)
    if err: return err

    try:
        app = JobApplication.objects.get(pk=pk, user=request.user)
    except JobApplication.DoesNotExist:
        return JsonResponse({"error": "Not found"}, status=404)

    if request.method == "GET":
        return JsonResponse(_serialize(app), safe=False)

    if request.method == "DELETE":
        app.delete()
        return JsonResponse({"ok": True})

    # PUT/PATCH
    data = json.loads(request.body or "{}")
    if "company" in data or "company_name" in data:
        app.company_name = (data.get("company") or data.get("company_name") or "")[:255]
    if "role" in data or "position" in data:
        app.position = (data.get("role") or data.get("position") or "")[:255]
    if "status" in data:
        app.status = data["status"] or "applied"
    if "notes" in data:
        app.notes = data["notes"] or ""
    if "next_followup_on" in data or "follow_up_date" in data:
        raw = data.get("next_followup_on") or data.get("follow_up_date")
        app.follow_up_date = parse_date(raw) if raw else None
    app.save()
    return JsonResponse(_serialize(app))

# ---------- notes endpoints ----------
@require_http_methods(["GET", "POST"])
def application_notes_view(request, pk: int):
    err = _require_auth(request)
    if err: return err

    try:
        application = JobApplication.objects.get(pk=pk, user=request.user)
    except JobApplication.DoesNotExist:
        return JsonResponse({"error": "Application not found"}, status=404)

    if request.method == "GET":
        notes = ApplicationNote.objects.filter(application=application)
        return JsonResponse([_serialize_note(note) for note in notes], safe=False)

    elif request.method == "POST":
        data = json.loads(request.body or "{}")
        content = data.get("content", "").strip()
        
        if not content:
            return JsonResponse({"error": "Content is required"}, status=400)
        
        note = ApplicationNote.objects.create(
            application=application,
            content=content
        )
        return JsonResponse(_serialize_note(note), status=201)

@require_http_methods(["GET", "PUT", "PATCH", "DELETE"])
def application_note_detail_view(request, pk: int, note_id: int):
    err = _require_auth(request)
    if err: return err

    try:
        application = JobApplication.objects.get(pk=pk, user=request.user)
    except JobApplication.DoesNotExist:
        return JsonResponse({"error": "Application not found"}, status=404)

    try:
        note = ApplicationNote.objects.get(id=note_id, application=application)
    except ApplicationNote.DoesNotExist:
        return JsonResponse({"error": "Note not found"}, status=404)

    if request.method == "GET":
        return JsonResponse(_serialize_note(note))

    elif request.method == "DELETE":
        note.delete()
        return JsonResponse({"ok": True})

    elif request.method in ["PUT", "PATCH"]:
        data = json.loads(request.body or "{}")
        content = data.get("content", "").strip()
        
        if not content:
            return JsonResponse({"error": "Content is required"}, status=400)
        
        note.content = content
        note.save()
        return JsonResponse(_serialize_note(note))