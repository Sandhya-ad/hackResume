# applications/serializers.py
from rest_framework import serializers
from .models import JobApplication

class JobApplicationSerializer(serializers.ModelSerializer):
    company = serializers.CharField(source="company_name")
    role = serializers.CharField(source="position", allow_blank=True, required=False)
    next_followup_on = serializers.DateField(source="follow_up_date", allow_null=True, required=False)

    class Meta:
        model = JobApplication
        fields = ["id", "company", "role", "status", "date_applied", "next_followup_on"]

from rest_framework import serializers
from .models import JobApplication, ApplicationNote

class ApplicationNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationNote
        fields = ["id", "content", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

class JobApplicationSerializer(serializers.ModelSerializer):
    company = serializers.CharField(source="company_name")
    role = serializers.CharField(source="position", allow_blank=True, required=False)
    next_followup_on = serializers.DateField(source="follow_up_date", allow_null=True, required=False)
    notes = ApplicationNoteSerializer(source="application_notes", many=True, read_only=True)
    
    class Meta:
        model = JobApplication
        fields = ["id", "company", "role", "status", "date_applied", "next_followup_on", "notes"]
