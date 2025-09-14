from django.db import models
from django.conf import settings

# job application model
class JobApplication(models.Model):
    STATUS_CHOICES = [
        ("applied", "Applied"),
        ("interview", "Interview"),
        ("offer", "Offer"),
        ("rejected", "Rejected"),
        ("oa", "OA"),
        ("ghosted", "No Response"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)    
    company_name = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    date_applied = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True, default="")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="applied")
    follow_up_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.company_name} - {self.position}"

class ApplicationNote(models.Model):
    application = models.ForeignKey(
        JobApplication, 
        on_delete=models.CASCADE, 
        related_name='application_notes'
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Note for {self.application.company_name}: {self.content[:50]}..."
