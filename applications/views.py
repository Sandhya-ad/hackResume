from django.shortcuts import render

from .models import JobApplication

# application view
def applications_view(request):
    # retrieve all job applications
    if request.method == 'GET':
        apps = list(JobApplication.objects.values())
        return jsonResponse(apps, safe=False)

    elif request.method == 'POST':
        try:
            # create a new job application
            data = json.loads(request.body)

            app = JobApplication.objects.create(
                company=data.get('company', ''),
                position=data.get('position', ''),
                date_applied=data.get('date_applied', None),
                status=data.get('status', 'Pending'),
                notes=data.get('notes', ''),
                follow_up_date=data.get('follow_up_date', None)
            )
            return JsonResponse({"id": app.id, "message": "Application created"}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid method"}, status=405)
