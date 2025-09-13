from django.shortcuts import render
from django.http import jsonResponse
from .models import JobApplication

# application view
def get_applications(request):
    apps = list(JobApplication.objects.values())
    return jsonResponse(apps, safe=False)
