import json
from django.http import JsonResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import Application, Note

def _note_to_dict(n: Note):
    return {
        "id": n.id,
        "type": n.type,
        "content": n.content,
        "occurred_at": n.occurred_at.isoformat(),
    }

def list_notes(request, app_id):
    if request.method != "GET":
        return HttpResponseNotAllowed(["GET"])
    app = get_object_or_404(Application, pk=app_id)
    data = [_note_to_dict(n) for n in app.notes.all()]
    return JsonResponse(data, safe=False)

@csrf_exempt
def create_note(request, app_id):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])
    app = get_object_or_404(Application, pk=app_id)
    payload = json.loads(request.body or "{}")
    n = Note.objects.create(
        application=app,
        type=payload.get("type","NOTE"),
        content=payload.get("content",""),
    )
    return JsonResponse(_note_to_dict(n), status=201)
