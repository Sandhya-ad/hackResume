from django.shortcuts import render
from django.http import JsonResponse
import json
from .models import JobApplication

# application view
def applications_view(request):
    if request.method == 'GET':
        # Get all applications
        apps = JobApplication.objects.all()
        # Group by status
        grouped = {}
        for app in apps:
            status = app.status
            if status not in grouped:
                grouped[status] = []
            grouped[status].append({
                "id": app.id,
                "company_name": app.company_name,
                "position": app.position,
                "date_applied": app.date_applied,
                "status": app.status,
                "notes": app.notes,
                "follow_up_date": app.follow_up_date,
            })
        return JsonResponse(grouped, safe=False)

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            app = JobApplication.objects.create(
                user=request.user,
                company_name=data.get('company_name', ''),
                position=data.get('position', ''),
                status=data.get('status', 'applied'),
                notes=data.get('notes', ''),
                follow_up_date=data.get('follow_up_date', None)
            )
            return JsonResponse({"id": app.id, "message": "Application created"}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid method"}, status=405)
